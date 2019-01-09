'use strict';

import _ from 'lodash'
import log from 'winston'
import pmap from 'p-map'
import {format} from 'util'
import request from 'request-promise'
import { EventEmitter } from 'events'

import * as Common from './util/Common'
import Cache from './util/Cache'
import PhaseGroup from './PhaseGroup'

const PHASE_URL = 'https://api.smash.gg/phase/%s?%s';
const LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
const DEFAULT_ENCODING = 'json';
const DEFAULT_CONCURRENCY = 4;

/* Interfaces */
import { ICommon } from './interfaces/ICommon'
import { IPhase } from './interfaces/IPhase'
import { IPlayer } from './interfaces/IPlayer'
import { IGGSet } from './interfaces/IGGSet'
import { IPhaseGroup } from './interfaces/IPhaseGroup'

/* Types */
import TPlayer = IPlayer.Player
import TGGSet = IGGSet.GGSet
import TPhaseGroup = IPhaseGroup.PhaseGroup

import Data = IPhase.Data
import Entity = IPhase.Entity
import Options = ICommon.Options
import PhaseOptions = IPhase.Options
import CommonOptions = ICommon.Options
import parseOptions = ICommon.parseOptions
import parsePhaseOptions = IPhase.parseOptions

export default class Phase extends EventEmitter implements IPhase.Phase{

	id: number = 0
	url: string = ''
	data: Data | string = IPhase.getDefaultData()
	isCached: boolean = true
	rawEncoding: string = DEFAULT_ENCODING
	expandsString: string = ''
	expands: IPhase.Expands = IPhase.getDefaultExpands()

	constructor(id: number, options: PhaseOptions = {}){
		super();

		if(!id)
			throw new Error('ID cannot be null for Phase Group');

		// parse options
		options = IPhase.parseOptions(options);
		this.isCached = options.isCached == true;
		this.rawEncoding = LEGAL_ENCODINGS.includes(options.rawEncoding as string) ? options.rawEncoding as string : DEFAULT_ENCODING;

		// CREATE THE EXPANDS STRING
		this.expandsString = '';
		if(options.expands){
			this.expands = Object.assign(this.expands, options.expands);
		}
		for(let property in this.expands){
			if(this.expands.hasOwnProperty(property))
				this.expandsString += format('expand[]=%s&', property);
		}

		this.url = format(PHASE_URL, this.id, this.expandsString);

		let ThisPhase = this;
		this.load()
			.then(function(){
				let cacheKey = format('phase::%s::%s', ThisPhase.id, ThisPhase.expandsString);
				Cache.set(cacheKey, ThisPhase);
			})
			.then(function(){
				ThisPhase.emitPhaseReady();
			})
			.catch(function(err){
				console.error('Error creating Tournament. For more info, implement Tournament.on(\'error\')');
				log.error('Phase error: %s', err.message);
				ThisPhase.emitPhaseError(err);
			});
	}

	loadData(data: Data) : Data | string{
		let encoded: Data | string = this.rawEncoding == 'json' ? data : new Buffer(JSON.stringify(data)).toString(this.rawEncoding);
		this.data = encoded;
		return encoded;
	}

	getData() : Data{
		let decoded = this.rawEncoding == 'json' ? this.data as Data : JSON.parse(new Buffer(this.data.toString(), this.rawEncoding).toString('utf8'));
		return decoded;
	}

	// Convenience Methods
	static getPhase(id: number, options: PhaseOptions={}) : Promise<Phase> {
		return new Promise(function(resolve, reject){ 
			try{
				let P = new Phase(id, options);
				P.on('ready', function(){
					resolve(P);
				});
				P.on('error', function(e){
					log.error('getPhase error: %s', e);
					reject(e);
				});
			} catch(e){
				log.error('getPhase error: %s', e);
				reject(e);
			}
		})
	}

	async load(): Promise<Data | string> {
		log.debug('Phase.load called');
		log.verbose('Creating Phase from url: %s', this.url);
		try{
			if(!this.isCached)
				return await request(this.url);

			let cacheKey = format('phase::%s::%s::%s::data', this.id, this.rawEncoding, this.expandsString);
			let cached = await Cache.get(cacheKey);

			if(!cached){
				let response = await request(this.url);
				let encoded = this.loadData(JSON.parse(response));
				await Cache.set(cacheKey, encoded);
				return encoded;
			}
			else {
				this.data = cached;
				return this.data;
			}
		} catch(e){
			log.error('Phase.load error: %s', e.message);
			
			if(e.name === 'StatusCodeError' && e.message.indexOf('404') > -1){
				let s = format('No Phase with id [%s] ( %s )', this.id, this.url);
				log.error(s);
			}
			
			throw e;
		}
	}

	/** PROMISES **/
	async getPhaseGroups(options: Options={}) : Promise<Array<TPhaseGroup>>{
		log.debug('Phase.getGroups called');

		// parse options
		options = ICommon.parseOptions(options);
		
		try {
			let cacheKey = format('phase::%s::groups', this.id);
			if (options.isCached) {
				let cached = await Cache.get(cacheKey);
				if (cached) return cached;
				
			}

			let groups: Array<Entity> = this.getData().entities.groups;
			let fn = async (group: Entity) : Promise<TPhaseGroup> => {
				return await PhaseGroup.getPhaseGroup(group.id);
			};
			let allPhaseGroups: TPhaseGroup[] = await pmap(groups, fn, {concurrency: options.concurrency});

			allPhaseGroups = _.uniqBy(allPhaseGroups, 'id');
			Cache.set(cacheKey, allPhaseGroups);
			return allPhaseGroups;
		}
		catch(err){
			log.error('Phase.getGroups: ' + err);
			throw err;
		}
	}

	async getSets(options: Options={}) : Promise<Array<TGGSet>>{
		log.debug('Phase.getSets called');

		try{
			// parse options
			options = ICommon.parseOptions(options)

			let cacheKey = format('phase::%s::sets', this.id);
			if(options.isCached){
				let cached = await Cache.get(cacheKey);
				if(cached) return cached;
			}

			let phaseGroups: Array<TPhaseGroup> = await this.getPhaseGroups(options);
			let fn = async (group: TPhaseGroup) : Promise<Array<TGGSet>> => {
				return await group.getSets(options);
			};
			let sets: TGGSet[][] = await pmap(phaseGroups, fn, {concurrency: options.concurrency});

			let flattened: TGGSet[] = _.flatten(sets);
			if(options.isCached) await Cache.set(cacheKey, flattened);
			return flattened;

		} catch(e){
			log.error('Phase.getSets error: %s', e);
			throw e;
		}
	}

	async getPlayers(options: Options={}) : Promise<Array<TPlayer>>{
		log.debug('Phase.getPlayers called');

		try{
			// parse options
			options = ICommon.parseOptions(options)

			let cacheKey = format('phase::%s::players', this.id);
			if(options.isCached){
				let cached = await Cache.get(cacheKey);
				if(cached) return cached;
			}

			let phaseGroups: Array<TPhaseGroup> = await this.getPhaseGroups(options);
			let fn = async (group: TPhaseGroup) : Promise<Array<TPlayer>> => {
				return await group.getPlayers(options);
			};
			let players: TPlayer[][] = await pmap(phaseGroups, fn, {concurrency: options.concurrency});

			let flattened: TPlayer[] = _.flatten(players);
			flattened = _.uniqBy(flattened, 'id');
			if(options.isCached) await Cache.set(cacheKey, flattened);
			return flattened;
		} catch(e){
			log.error('Phase.getPlayers error: %s', e);
			throw e;
		}
	}

	async getIncompleteSets(options: Options={}) : Promise<Array<TGGSet>>{
		log.debug('Phase.getIncompleteSets called');
		try{
			//parse options
			options = ICommon.parseOptions(options);

			let groups: Array<TPhaseGroup> = await this.getPhaseGroups(options);
			let fn = async (group : TPhaseGroup) : Promise<Array<TGGSet>> => {
				return await group.getIncompleteSets(options);
			};
			let sets: TGGSet[][] = await pmap(groups, fn, {concurrency: options.concurrency});
			let flattened: TGGSet[] = _.flatten(sets);
			return flattened;
		} catch(e){
			log.error('Phase.getIncompleteSets error: %s', e);
			throw e;
		}
	}

	async getCompleteSets(options: Options={}) : Promise<Array<TGGSet>>{
		log.debug('Phase.getIncompleteSets called');
		try{
			//parse options
			options = ICommon.parseOptions(options)

			let groups: Array<TPhaseGroup> = await this.getPhaseGroups(options);
			let fn = async (group: TPhaseGroup) : Promise<Array<TGGSet>> => {
				return await group.getCompleteSets(options);
			};
			let sets: TGGSet[][] = await pmap(groups, fn, {concurrency: options.concurrency});
			let flattened: TGGSet[] = _.flatten(sets);
			return flattened;
		} catch(e){
			log.error('Phase.getIncompleteSets error: %s', e);
			throw e;
		}
	}

	async getSetsXMinutesBack(minutesBack: number, options: Options={}) : Promise<Array<TGGSet>>{
		log.verbose('Phase.getSetsXMinutesBack called');
		try{
			// parse options
			options = ICommon.parseOptions(options)
			options.isCached = false;

			let groups: Array<TPhaseGroup> = await this.getPhaseGroups(options);
			let fn = async (group: TPhaseGroup) : Promise<Array<TGGSet>> => {
				return await group.getSetsXMinutesBack(minutesBack, options);
			};
			let sets: TGGSet[][] = await pmap(groups, fn, {concurrency: options.concurrency});
			let flattened: TGGSet[] = _.flatten(sets);
			return flattened;
		} catch(e){
			log.error('Phase.getSetsXMinutesBack error: %s', e);
			throw e;
		}
	}

	/** SIMPLE GETTERS **/
	getFromDataEntities(prop: string) : any{
		let data = this.getData();
		if(data && data.entities && data.entities.phase) {
			if (!data.entities.phase[prop])
				log.error(this.nullValueString(prop));
			return data.entities.phase[prop];
		}
		else{
			log.error('No data to get Tournament property Id');
			return null;
		}
	}

	getName() : string{
		return this.getFromDataEntities('name');
	}

	getEventId() : string{
		return this.getFromDataEntities('eventId');
	}

	/** NULL VALUES **/
	nullValueString(prop: string){
		return prop + ' not available for Phase ' + this.getData().entities.phase.name;
	}

	/** EVENTS **/
	emitPhaseReady() : void{
		this.emit('ready');
	}

	emitPhaseError(err: Error) : void{
		this.emit('error', err);
	}
}

Phase.prototype.toString = function(){
	return 'Phase: ' + 
		'\nID: ' + this.id + 
		'\nName: ' + this.getName() +
		'\nEvent ID: ' + this.getEventId();
};

module.exports = Phase;