import log from 'winston'
import request from 'request-promise'
import {format} from 'util'

import Cache from './util/Cache'
import {VideoGame} from './VideoGame'
import {ICommon} from './util/Common'

import Options = ICommon.Options
import parseOptions = ICommon.parseOptions

const API_URL = 'https://api.smash.gg/characters'

class Character implements ICharacter.Character{

	id: number = 0
	name: string = ''
	isCommon: boolean = true
	videogameId: number = 1


	constructor(id: number, name: string, isCommon: boolean, videogameId: number){
		this.id = id
		this.name = name
		this.isCommon = isCommon
		this.videogameId = videogameId
	}

	getId(){
		return this.id
	}

	getName(){
		return this.name
	}

	getIsCommon(){
		return this.isCommon
	}

	getVideoGameId(){
		return this.videogameId
	}

	static async getAll(options: Options={}) : Promise<Character[]>{
		log.verbose('getAll called')
		try{
			// parse options
			options = parseOptions(options)

			let cacheKey = 'character::all'
			if(options.isCached){
				let cached = await Cache.getInstance().get(cacheKey) as Character[]
				if(cached) return cached
			}

			let req = {
				uri: API_URL,
				headers:{
					'X-SOURCE': 'smashgg.js'
				},
				method: 'GET'
			}

			let data: ICharacter.Data = JSON.parse(await request(req))
			let characters = data.entities.character.map(e => {
				return new Character(
					e.id,
					e.name,
					e.isCommon,
					e.videogameId
				)
			})

			if(options.isCached) await Cache.getInstance().set(cacheKey, characters)
			return characters
		} catch(e){
			log.error('getAll error: %s', e)
			throw e
		}
	}

	static async getById(id: number, options: Options={}) : Promise<Character | undefined>{
		log.verbose('Character.getById called')
		try{
			// parse options
			options = parseOptions(options)

			let cacheKey = format('character::id::%s', id)
			if(options.isCached){
				let cached = await Cache.getInstance().get(cacheKey) as Character
				if(cached) return cached
			}

			let characters: Character[] = await Character.getAll(options)
			let match = characters.filter(e => { return e.id === id; })
			let character: Character | undefined = match.length > 0 ? match[0] : undefined

			if(options.isCached) await Cache.getInstance().set(cacheKey, characters)
			return character
		} catch(e){
			log.error('Character.getById error: %s', e)
			throw e
		}
	}

	static async getByGameId(id: number, options: Options={}) : Promise<Character[]>{
		log.verbose('Character.getByGameId called')
		try{
			// parse options
			options = parseOptions(options)

			let cacheKey = format('character::videogameId::%s', id)
			if(options.isCached){
				let cached = await Cache.getInstance().get(cacheKey) as Character[]
				if(cached) return cached
			}

			let characters: Character[] = await Character.getAll(options)
			characters = characters.filter(e => { return e.videogameId === id; })

			if(options.isCached) await Cache.getInstance().set(cacheKey, characters)
			return characters
		} catch(e){
			log.error('Character.getByGameId error: %s', e)
			throw e
		}
	}

	static async getByGameName(name: string, options: Options={}) : Promise<Character[]>{
		log.verbose('Character.getByGameName called')
		try{
			// parse options
			options = parseOptions(options)

			let cacheKey = format('character::videgameName::%s', name)
			if(options.isCached){
				let cached = await Cache.getInstance().get(cacheKey) as Character[]
				if(cached) return cached
			}

			let videoGame = await VideoGame.getByName(name, options)
			if(!videoGame) throw new Error('No game by the name ' + name)

			let character: Character[] = await Character.getByGameId(videoGame.id , options)

			if(options.isCached) await Cache.getInstance().set(cacheKey, character)
			return character
		} catch(e){
			log.error('Character.getByGameName error: %s', e)
			throw e
		}
	}

	static async getByName(name: string, options: Options={}) : Promise<Character[]>{
		log.verbose('Characters.getByName called')
		try{
			// parse options
			options = parseOptions(options)

			let cacheKey = format('characters::name::%s', name)
			if(options.isCached){
				let cached = await Cache.getInstance().get(cacheKey) as Character[]
				if(cached) return cached
			}

			let characters: Character[] = await Character.getAll(options)
			characters = characters.filter(e => { 
				return e.name.toLowerCase() === name.toLowerCase(); 
			})

			if(options.isCached) await Cache.getInstance().set(cacheKey, characters)
			return characters
		} catch(e){
			log.error('Characters.getByName error: %s', e)
			throw e
		}
	}

	static async getByNameAndGameId(name: string, videogameId: number, options: Options={}) : Promise<Character | undefined>{
		log.verbose('Character.getByNameAndGame called')
		try{
			// parse options
			options = parseOptions(options)

			let cacheKey = format('characters::name::%s::videogameId::%s', name, videogameId)
			if(options.isCached){
				let cached = await Cache.getInstance().get(cacheKey) as Character
				if(cached) return cached
			}

			let characters: Character[] = await Character.getByName(name, options)
			let match = characters.filter(e => { return e.videogameId == videogameId; })
			let character: Character | undefined = match.length > 0 ? match[0] : undefined

			if(options.isCached) await Cache.getInstance().set(cacheKey, character)
			return character
		} catch(e){
			log.error('Character.getByNameAndGame error: %s', e)
			throw e
		}
	}

	static async getByNameAndGame(name: string, gameName: string, options: Options={}) : Promise<Character | undefined>{
		log.verbose('Character.getByNameAndGame called')
		try{
			// parse options
			let isCached = options.isCached != undefined ? options.isCached == true : true

			let cacheKey = format('characters::name::%s::game::%s', name, gameName)
			if(isCached){
				let cached = await Cache.getInstance().get(cacheKey) as Character
				if(cached) return cached
			}

			let characters: Character[] = await Character.getByName(name, options)
			let videogame: VideoGame = await VideoGame.getByName(gameName, options)
			let match = characters.filter(e => { return e.videogameId == videogame.id; })
			let character: Character | undefined = match.length > 0 ? match[0] : undefined

			await Cache.getInstance().set(cacheKey, character)
			return character
		} catch(e){
			log.error('Character.getByNameAndGame error: %s', e)
			throw e
		}
	}
}

Character.prototype.toString = function(){
	return 'Character: ' + 
		'\nName: ' + this.name + 
		'\nID: ' + this.id + 
		'\nVideoGame ID: ' + this.videogameId + 
		'\nIs Common? ' + this.isCommon
}

export namespace ICharacter{

	export interface Character{
		id: number
		name: string
		isCommon: boolean
		videogameId: number

		getId(): number
		getName(): string
		getIsCommon(): boolean
		getVideoGameId(): number
	}

	export interface Data{
		entities: Entity,
		[x: string]: any
	}

	export interface Entity{
		character: [CharacterEntity],
		[x: string]: any
	}

	export interface CharacterEntity{
		id: number,
		name: string, 
		isCommon: boolean,
		videogameId: number
	}

}