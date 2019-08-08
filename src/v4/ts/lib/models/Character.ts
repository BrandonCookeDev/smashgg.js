import log from '../util/Logger'
import request from 'request-promise'
import {format} from 'util'

import {
	ICharacter,
	ICharacterData,
	ICharacterEntity
} from '../interfaces/ICharacter'
import {IVideoGame} from '../interfaces/IVideoGame'

import {ICommonOptions} from '../interfaces/ICommon'

import Cache from '../util/Cache'
import {VideoGame} from './VideoGame'
import {parseOptions} from '../util/Common'

const API_URL = 'https://api.smash.gg/characters'

export class Character implements ICharacter{

	public static async getAll(options: ICommonOptions={}): Promise<ICharacter[]>{
		log.debug('getAll called')
		try{
			// parse options
			options = parseOptions(options)

			const cacheKey = 'character::all'
			if(options.isCached){
				const cached = await Cache.getInstance().get(cacheKey) as ICharacter[]
				if(cached) return cached
			}

			const req = {
				uri: API_URL,
				headers:{
					'X-SOURCE': 'smashgg.js'
				},
				method: 'GET'
			}

			const data: ICharacterData = JSON.parse(await request(req))
			const characters = data.entities.character.map((e: ICharacterEntity ) => {
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

	public static async getById(id: number, options: ICommonOptions={}): Promise<ICharacter | undefined>{
		log.debug('Character.getById called')
		try{
			// parse options
			options = parseOptions(options)

			const cacheKey = format('character::id::%s', id)
			if(options.isCached){
				const cached = await Cache.getInstance().get(cacheKey) as ICharacter
				if(cached) return cached
			}

			const characters: ICharacter[] = await Character.getAll(options)
			const match = characters.filter((c: ICharacter) => c.getId() === id)
			const character: ICharacter | undefined = match.length > 0 ? match[0] : undefined

			if(options.isCached) await Cache.getInstance().set(cacheKey, characters)
			return character
		} catch(e){
			log.error('Character.getById error: %s', e)
			throw e
		}
	}

	public static async getByGameId(id: number, options: ICommonOptions={}): Promise<ICharacter[]>{
		log.debug('Character.getByGameId called')
		try{
			// parse options
			options = parseOptions(options)

			const cacheKey = format('character::videogameId::%s', id)
			if(options.isCached){
				const cached = await Cache.getInstance().get(cacheKey) as ICharacter[]
				if(cached) return cached
			}

			let characters: ICharacter[] = await Character.getAll(options)
			characters = characters.filter((c: ICharacter) =>  c.getVideoGameId() === id)

			if(options.isCached) await Cache.getInstance().set(cacheKey, characters)
			return characters
		} catch(e){
			log.error('Character.getByGameId error: %s', e)
			throw e
		}
	}

	public static async getByGameName(name: string, options: ICommonOptions={}): Promise<ICharacter[]>{
		log.debug('Character.getByGameName called')
		try{
			// parse options
			options = parseOptions(options)

			const cacheKey = format('character::videgameName::%s', name)
			if(options.isCached){
				const cached = await Cache.getInstance().get(cacheKey) as ICharacter[]
				if(cached) return cached
			}

			const videoGame: IVideoGame = await VideoGame.getByName(name, options)
			if(!videoGame) throw new Error('No game by the name ' + name)
			else if(!videoGame.getId()) throw new Error('No game id found!')

			const character: ICharacter[] = await Character.getByGameId(videoGame.getId()! , options)

			if(options.isCached) await Cache.getInstance().set(cacheKey, character)
			return character
		} catch(e){
			log.error('Character.getByGameName error: %s', e)
			throw e
		}
	}

	public static async getByName(name: string, options: ICommonOptions={}): Promise<ICharacter[]>{
		log.debug('Characters.getByName called')
		try{
			// parse options
			options = parseOptions(options)

			const cacheKey = format('characters::name::%s', name)
			if(options.isCached){
				const cached = await Cache.getInstance().get(cacheKey) as ICharacter[]
				if(cached) return cached
			}

			let characters: ICharacter[] = await Character.getAll(options)
			characters = characters.filter((c: ICharacter) => { 
				return c.getName().toLowerCase() === name.toLowerCase()
			})

			if(options.isCached) await Cache.getInstance().set(cacheKey, characters)
			return characters
		} catch(e){
			log.error('Characters.getByName error: %s', e)
			throw e
		}
	}

	public static async getByNameAndGameId(
		name: string, videogameId: number, options: ICommonOptions={}): Promise<ICharacter | undefined>{
		log.debug('Character.getByNameAndGame called')
		try{
			// parse options
			options = parseOptions(options)

			const cacheKey = format('characters::name::%s::videogameId::%s', name, videogameId)
			if(options.isCached){
				const cached = await Cache.getInstance().get(cacheKey) as ICharacter
				if(cached) return cached
			}

			const characters: ICharacter[] = await Character.getByName(name, options)
			const match = characters.filter((c: ICharacter) => c.getVideoGameId() === videogameId)
			const character: ICharacter | undefined = match.length > 0 ? match[0] : undefined

			if(options.isCached) await Cache.getInstance().set(cacheKey, character)
			return character
		} catch(e){
			log.error('Character.getByNameAndGame error: %s', e)
			throw e
		}
	}

	public static async getByNameAndGame(
		name: string, gameName: string, options: ICommonOptions={}): Promise<ICharacter | undefined>{
		log.debug('Character.getByNameAndGame called')
		try{
			// parse options
			const isCached = options.isCached !== undefined ? options.isCached === true : true

			const cacheKey = format('characters::name::%s::game::%s', name, gameName)
			if(isCached){
				const cached = await Cache.getInstance().get(cacheKey) as ICharacter
				if(cached) return cached
			}

			const characters: ICharacter[] = await Character.getByName(name, options)
			const videogame: IVideoGame = await VideoGame.getByName(gameName, options)
			const match = characters.filter((c: ICharacter) => c.getVideoGameId() === videogame.getId())
			const character: ICharacter | undefined = match.length > 0 ? match[0] : undefined

			await Cache.getInstance().set(cacheKey, character)
			return character
		} catch(e){
			log.error('Character.getByNameAndGame error: %s', e)
			throw e
		}
	}

	private id: number = 0
	private name: string = ''
	private isCommon: boolean = true
	private videogameId: number = 1

	constructor(id: number, name: string, isCommon: boolean, videogameId: number){
		this.id = id
		this.name = name
		this.isCommon = isCommon
		this.videogameId = videogameId
	}

	public getId(){
		return this.id
	}

	public getName(){
		return this.name
	}

	public getIsCommon(){
		return this.isCommon
	}

	public getVideoGameId(){
		return this.videogameId
	}

}

Character.prototype.toString = function(){
	return 'Character: ' + 
		'\nName: ' + this.getName() + 
		'\nID: ' + this.getId() + 
		'\nVideoGame ID: ' + this.getVideoGameId() + 
		'\nIs Common? ' + this.getIsCommon()
}
