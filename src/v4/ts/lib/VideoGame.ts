import request from 'request-promise'
import { format } from 'util'
import Cache from './util/Cache'

import {
	IVideoGame,
	IVideoGameData,
	IVideoGameDataFull,
	IVideoGameOptions
} from './interfaces/IVideoGame'
import log from './util/Logger'

const API_URL = 'https://api.smash.gg/public/videogames'
// const LEGAL_ENCODINGS = ['json', 'utf8', 'base64']
// const DEFAULT_ENCODING = 'json'

export class VideoGame implements IVideoGame{

	public static resolve(data: IVideoGameData): IVideoGame {
		const vg = new VideoGame(
			data.id,
			data.name,
			data.abbrev,
			data.displayName,
			data.minPerEntry,
			data.maxPerEntry,
			data.approved,
			data.slug,
			data.isCardGame
		)
		vg.loadData(data, 'json')
		return vg
	}

	public static async getAll(options: IVideoGameOptions={}): Promise<IVideoGame[]>{
		log.debug('VideoGames getAll called')
		try{
			// parse options
			options = VideoGame.parseOptions(options)

			const cacheKey = 'videoGames::all'
			if(options.isCached){
				const cached: VideoGame[] = await Cache.getInstance().get(cacheKey) as VideoGame[]
				if(cached) return cached
			}
			
			const data: IVideoGameDataFull = JSON.parse(await request(API_URL))
			const videoGames = data.entities.videogame.map((vg: IVideoGameData) => VideoGame.resolve(vg))

			if(options.isCached) await Cache.getInstance().set(cacheKey, videoGames)
			return videoGames
		} catch(e){
			log.error('VideoGames getAll error: %s', e)
			throw e
		}
	}

	public static async getById(id: number, options: IVideoGameOptions={}): Promise<IVideoGame> {
		log.debug('VideoGame getById called [%s]', id)
		try{
			// parse options
			options = VideoGame.parseOptions(options)

			const cacheKey = format('VideoGame::id::%s', id)
			if(options.isCached){
				const cached = await Cache.getInstance().get(cacheKey) as VideoGame
				if(cached) return cached
			}

			const data: IVideoGame[] = await VideoGame.getAll(options)
			const videoGames = data.filter((vg: IVideoGame) => vg.getId() === id)

			if(videoGames.length <= 0) throw new Error('No video game with id ' + id)
			const videoGame = videoGames[0]

			if(options.isCached) Cache.getInstance().set(cacheKey, videoGame)
			return videoGame
		} catch(e){
			log.error('VideoGame getById error: %s', e)
			throw e
		}
	}

	public static async getByName(name: string, options: IVideoGameOptions={}): Promise<IVideoGame> {
		log.debug('VideoGame getByName called [%s]', name)
		try{
			// parse options
			const isCached = options.isCached || true

			const cacheKey = format('VideoGame::name::%s', name)
			if(isCached){
				const cached = await Cache.getInstance().get(cacheKey) as VideoGame
				if(cached) return cached
			}

			const data = await VideoGame.getAll()
			const videoGames = data.filter((vg: IVideoGame) => {
				return vg.getName() === name || 
					vg.getAbbreviation() === name ||
					vg.getSlug() === name ||
					vg.getDisplayName() === name
			})
			
			if(videoGames.length <= 0) throw new Error('No video game with name ' + name)
			const videoGame = videoGames[0]

			if(isCached) Cache.getInstance().set(cacheKey, videoGame)
			return videoGame
		} catch(e){
			log.error('VideoGame getByName error: %s', e)
			throw e
		}
	}

	public static parseOptions(options: IVideoGameOptions): IVideoGameOptions {
		return {
			isCached: options != null && options.isCached === true ? options.isCached : true
		}
	}

	private id: number = 0
	private data: IVideoGameData | string = ''
	private name: string
	private abbrev: string
	private displayName: string
	private minPerEntry: number
	private maxPerEntry: number
	private approved: boolean
	private slug: string 
	private isCardGame: boolean
	private rawEncoding: string = 'json'

	constructor(
		id: number, name: string, abbrev: string, displayName: string, minPerEntry: number, 
		maxPerEntry: number, approved: boolean, slug: string, isCardGame: boolean
	){
		this.id = id
		this.name = name
		this.abbrev = abbrev
		this.displayName = displayName
		this.minPerEntry = minPerEntry
		this.maxPerEntry = maxPerEntry
		this.approved = approved
		this.slug = slug
		this.isCardGame = isCardGame
	}

	public loadData(data: IVideoGameData, encoding: string): IVideoGameData | string{
		const encoded = encoding === 'json' ? 
			data 
			: 
			new Buffer(JSON.stringify(data)).toString(encoding)
		this.data = encoded
		return encoded
	}

	public getData(data: IVideoGameData, encoding: string): IVideoGameData {
		const decoded = this.rawEncoding === 'json' ? 
			data 
			: 
			JSON.parse(new Buffer(data.toString(), encoding).toString('utf8'))
		return decoded
	}

	public getId(): number | undefined{
		return this.id
	}

	public getName(): string | undefined{
		return this.name
	}

	public getAbbreviation(): string | undefined{
		return this.abbrev
	}

	public getDisplayName(): string | undefined{
		return this.displayName
	}

	public getMinPerEntry(): number | undefined{
		return this.minPerEntry
	}

	public getMaxPerEntry(): number | undefined{
		return this.maxPerEntry
	}

	public getApproved(): boolean | undefined{
		return this.approved
	}

	public getSlug(): string | undefined{
		return this.slug
	}

	public getIsCardGame(): boolean | undefined{
		return this.isCardGame
	}

}
