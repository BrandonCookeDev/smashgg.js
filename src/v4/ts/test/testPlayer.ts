/* eslint-disable */
import '../lib/util/ErrorHandler'

import _ from 'lodash'
import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import {Player, IPlayer} from '../lib/internal'
import Cache from '../lib/util/Cache'

import expected from './data/testPlayers'

let p1: Player,
 	p2: Player,
 	p3: Player;

describe('Smash GG Player', function(){

	before(Cache.flush)

	it('should correctly load a player from raw data', function(done){
		p1 = Player.resolve(expected.players[0] as IPlayer.Entity);
		p2 = Player.resolve(expected.players[1] as IPlayer.Entity);
		p3 = Player.resolve(expected.players[2] as IPlayer.Entity);

		expect(p1.id).to.be.equal(21568)
		expect(p2.id).to.be.equal(244170)
		expect(p3.id).to.be.equal(36490)

		expect(p1.tag).to.be.equal('Gas$')
		expect(p2.tag).to.be.equal('T')
		expect(p3.tag).to.be.equal('Kiwiwizard')

		expect(p1.name).to.be.equal('Grayson Garrett')
		expect(p2.name).to.be.equal('Trevor Greiff')
		expect(p3.name).to.be.equal('Davis Balser')

		expect(p1.country).to.be.equal('United States')
		expect(p2.country).to.be.equal('United States')
		expect(p3.country).to.be.equal('US')

		expect(p1.state).to.be.equal('GA')
		expect(p2.state).to.be.equal('TN')
		expect(p3.state).to.be.equal('GA')

		expect(p1.sponsor).to.be.equal('Test1')
		expect(p2.sponsor).to.be.equal('Test2')
		expect(p3.sponsor).to.be.equal('Test3')

		expect(p1.data).to.be.equal(expected.players[0])
		expect(p2.data).to.be.equal(expected.players[1])
		expect(p3.data).to.be.equal(expected.players[2])

		done()
	})

	it('should get player by id correctly', async function(){
		this.timeout(5000)

		let player1 = await Player.getPlayer(61838)
		let player2 = await Player.getPlayer(61839)

		return true
	})

})