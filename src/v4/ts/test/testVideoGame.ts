/* eslint-disable */
import '../lib/util/ErrorHandler'

import chai from 'chai'
const {expect} = chai

import {VideoGame} from '../lib/VideoGame'
import Cache from '../lib/util/Cache'

let expected = {
	Melee: {
		id:1,
		data: {
			"abbrev": "Melee",
			"approved": true,
			"characterTerm": [null],
			"displayName": "Melee",
			"enabled": "1",
			"expand": [],
			"gameTerm": [null],
			"id": 1,
			"images": [
			  {
			    "createdAt": [null],
			    "entity": [null],
			    "entityId": [null],
			    "height": 190,
			    "id": 6180,
			    "isOriginal": true,
			    "ratio": 0.73,
			    "type": "primary",
			    "updatedAt": [null],
			    "uploadedBy": [null],
			    "url": "https://images.smash.gg/images/videogame/1/image-f26ab87b8de31d78597a664d225e1c71.jpg",
			    "width": 138
			  },
			],
			"initialStocks": [null],
			"isCardGame": [null],
			"maxPerEntry": 2,
			"minPerEntry": 1,
			"name": "Super Smash Bros. Melee",
			"slug": "melee",
			"stageTerm": [null]
		},
		name:'Super Smash Bros. Melee',
		abbrev:'Melee',
		displayName:'Melee',
		minPerEntry:1,
		maxPerEntry:2,
		approved:true,
		slug:'melee',
		rawEncoding: 'json',
		isCardGame:null
	},
	PM: {
		id:2,
		data: {
			"abbrev": "pm",
			"approved": true,
			"characterTerm": [null],
			"displayName": "PM",
			"enabled": "1",
			"expand": [],
			"gameTerm": [null],
			"id": 2,
			"images": [
				{
					"createdAt": [null],
					"entity": [null],
					"entityId": [null],
					"height": 512,
					"id": 1330116,
					"isOriginal": true,
					"ratio": 0.73,
					"type": "primary",
					"updatedAt": [null],
					"uploadedBy": [null],
					"url": "https://images.smash.gg/images/videogame/2/image-11a8d11dbd2af24429b41b7e6a166f42.png",
					"width": 372,
				},
			],
			"initialStocks": [null],
			"isCardGame": [null],
			"maxPerEntry": [null],
			"minPerEntry": [null],
			"name": "Project M",
			"slug": "pm",
			"stageTerm": [null],
		},
		name:'Project M',
		abbrev:'pm',
		displayName:'PM',
		minPerEntry:null,
		maxPerEntry:null,
		approved:true,
		slug:'pm',
		rawEncoding: 'json',
		isCardGame:null
	}
}

function eq(original: any, other: VideoGame) : boolean{
	return other.id === original.id &&
		other.name === original.name &&
		other.abbrev === original.abbrev &&
		other.displayName === original.displayName &&
		other.minPerEntry === original.minPerEntry &&
		other.maxPerEntry === original.maxPerEntry &&
		other.approved === original.approved &&
		other.slug === original.slug &&
		other.rawEncoding === original.rawEncoding &&
		other.isCardGame === original.isCardGame;
}

describe('SmashGG VideoGame', function(){
	
	before(async function(){
		Cache.flush();
	})

	it('should get all video games from api', async function(){
		let videoGames = await VideoGame.getAll();
		videoGames.forEach(e => {
			expect(e).to.be.instanceof(VideoGame);
		})
		return true;
	})

	it('should get correct video game by id', async function(){
		let vg1 = await VideoGame.getById(1);

		expect(eq(expected.Melee, vg1)).to.be.true;

		return true;
	})

	it('should get correct video game by id 2', async function(){
		let vg2 = await VideoGame.getById(2);

		expect(eq(expected.PM, vg2)).to.be.true;

		return true;
	})

	it('should get correct video game by name', async function(){
		let melee1 = await VideoGame.getByName('Super Smash Bros. Melee', {isCached:false});
		let melee2 = await VideoGame.getByName('melee', {isCached:false});
		let pm1 = await VideoGame.getByName('pm');
		let pm2 = await VideoGame.getByName('Project M')

		expect(eq(expected.Melee, melee1)).to.be.true;
		expect(eq(expected.Melee, melee2)).to.be.true;
		expect(eq(expected.PM, pm1)).to.be.true;
		expect(eq(expected.PM, pm2)).to.be.true;

		return true;
	})
})