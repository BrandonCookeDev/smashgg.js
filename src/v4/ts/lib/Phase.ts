'use strict';

import _ from 'lodash'
import pmap from 'p-map'
import {format} from 'util'
import request from 'request-promise'
import { EventEmitter } from 'events'

import * as Common from './util/Common'
import {PhaseGroup, GGSet, Entrant} from './internal'
import Cache from './util/Cache'
import Encoder from './util/Encoder'
import log from './util/Logger'

const PHASE_URL = 'https://api.smash.gg/phase/%s?%s';
const LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
const DEFAULT_ENCODING = 'json';
const DEFAULT_CONCURRENCY = 4;

import { ICommon } from './util/Common'

import Data = IPhase.Data
import Entity = IPhase.Entity
import Options = ICommon.Options
import PhaseOptions = IPhase.Options
import CommonOptions = ICommon.Options
import parseOptions = ICommon.parseOptions
import parsePhaseOptions = IPhase.parseOptions

export class Phase implements IPhase.Phase{

	id: number
	name: string
	numSeeds: number
	groupCount: number

	constructor(
		id: number,
		name: string,
		numSeeds: number,
		groupCount: number
	){
		this.id = id
		this.name = name
		this.numSeeds = numSeeds
		this.groupCount = groupCount
	}

}

export namespace IPhase{
	export interface Phase{
		
		id: number
		name: string
		numSeeds: number
		groupCount: number

		
		getPhaseGroups(options: Options) : Promise<PhaseGroup[]>
		getSets(options: Options) : Promise<GGSet[]>
		getPlayers(options: Options) : Promise<Entrant[]>
		getIncompleteSets(options: Options) : Promise<GGSet[]>
		getCompleteSets(options: Options) : Promise<GGSet[]>
		getSetsXMinutesBack(minutesBack: number, options: Options) : Promise<GGSet[]>
		getName() : string
		getEventId() : number
	}

	export interface Options{
		isCached?: boolean,
		expands?: Expands,
		rawEncoding?: string
	}

	export interface Expands{
		groups: boolean
	}

	export interface Data{
		id: number,
		[x: string]: any
	}

	export interface Entity{
		id: number,
		[x: string]: any
	}

	export function getDefaultData(){
		return {
			id: 0
		}
	}

	export function getDefaultExpands(){
		return {
			groups: true
		}
	}

	export function getDefaultOptions() : Options{
		return {
			expands: {
				groups: true
			},
			isCached: true,
			rawEncoding: 'json'
		}
	}

	export function parseOptions(options: Options) : Options{
		return{
			expands: {
				groups: (options.expands != undefined && options.expands.groups == false) ? false : true
			},
			isCached: options.isCached != undefined ? options.isCached === true : true,
			rawEncoding: Encoder.determineEncoding(options.rawEncoding)
		}
	}
}