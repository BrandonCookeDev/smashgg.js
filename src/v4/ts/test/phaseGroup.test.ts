import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env');
import {config} from 'dotenv'
config({path: ROOT})

import '../lib/util/ErrorHandler'

import _ from 'lodash'
import moment from 'moment'
import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import {PhaseGroup, IPhaseGroup} from '../lib/PhaseGroup'
import {Entrant} from '../lib/Entrant'
import {GGSet} from '../lib/GGSet'
import Initializer from '../lib/util/Initializer'
import * as testData from './data/phaseGroup.testData'
import * as log from '../lib/util/Logger'


let phaseGroup1: PhaseGroup;
let phaseGroup2: PhaseGroup;
let phaseGroup3: PhaseGroup;
let phaseGroup4: PhaseGroup;

const ID1 = 301994
const ID2 = 887918 // g6 melee doubles top 6
const ID3 = 44445
const ID4 = 618443 // cameron's 21st, unfinished

const LOG_LEVEL = log.levels.VERBOSE

describe('smash.gg PhaseGroup', function(){
	this.timeout(15000)

	before(async function(){
		log.setLogLevel(LOG_LEVEL)
		await Initializer(process.env.API_TOKEN!)
		phaseGroup1 = await PhaseGroup.get(ID1)
		phaseGroup2 = await PhaseGroup.get(ID2)
		phaseGroup3 = await PhaseGroup.get(ID3)
		phaseGroup4 = await PhaseGroup.get(ID4)
		return true
	})

	// id
	it('should return the correct phase group id 1', function(){
		expect(phaseGroup1.getId()).to.be.equal(testData.pg1.id)
	})
	it('should return the correct phase group id 2', function(){
		expect(phaseGroup2.getId()).to.be.equal(testData.pg2.id)
	})
	it('should return the correct phase group id 3', function(){
		expect(phaseGroup3.getId()).to.be.equal(testData.pg3.id)
	})
	it('should return the correct phase group id 4', function(){
		expect(phaseGroup4.getId()).to.be.equal(testData.pg4.id)
	})


	// phase id
	it('should return the correct phase id 1', function(){
		expect(phaseGroup1.getPhaseId()).to.be.equal(testData.pg1.phaseId)
	})
	it('should return the correct phase id 2', function(){
		expect(phaseGroup2.getPhaseId()).to.be.equal(testData.pg2.phaseId)
	})
	it('should return the correct phase id 3', function(){
		expect(phaseGroup3.getPhaseId()).to.be.equal(testData.pg3.phaseId)
	})
	it('should return the correct phase id 4', function(){
		expect(phaseGroup4.getPhaseId()).to.be.equal(testData.pg4.phaseId)
	})


	// displayIdentifier
	it('should return the correct display identifier 1', function(){
		expect(phaseGroup1.getDisplayIdentifier()).to.be.equal(testData.pg1.displayIdentifier)
	})
	it('should return the correct display identifier 2', function(){
		expect(phaseGroup2.getDisplayIdentifier()).to.be.equal(testData.pg2.displayIdentifier)
	})
	it('should return the correct display identifier 3', function(){
		expect(phaseGroup3.getDisplayIdentifier()).to.be.equal(testData.pg3.displayIdentifier)
	})
	it('should return the correct display identifier 4', function(){
		expect(phaseGroup4.getDisplayIdentifier()).to.be.equal(testData.pg4.displayIdentifier)
	})


	// firstRoundTime
	it('should return the correct first round time 1', function(){
		expect(phaseGroup1.getFirstRoundTime()).to.be.equal(testData.pg1.firstRoundTime)
	})
	it('should return the correct first round time 2', function(){
		expect(phaseGroup2.getFirstRoundTime()).to.be.equal(testData.pg2.firstRoundTime)
	})
	it('should return the correct first round time 3', function(){
		expect(phaseGroup3.getFirstRoundTime()).to.be.equal(testData.pg3.firstRoundTime)
	})
	it('should return the correct first round time 4', function(){
		expect(phaseGroup4.getFirstRoundTime()).to.be.equal(testData.pg4.firstRoundTime)
	})


	// wave id
	it('should return the correct wave id 1', function(){
		expect(phaseGroup1.getWaveId()).to.be.equal(testData.pg1.waveId)
	})
	it('should return the correct wave id 2', function(){
		expect(phaseGroup2.getWaveId()).to.be.equal(testData.pg2.waveId)
	})
	it('should return the correct wave id 3', function(){
		expect(phaseGroup3.getWaveId()).to.be.equal(testData.pg3.waveId)
	})
	it('should return the correct wave id 4', function(){
		expect(phaseGroup4.getWaveId()).to.be.equal(testData.pg4.waveId)
	})


	// tiebreaker
	it('should return the correct tiebreaker order 1', function(){
		expect(phaseGroup1.getTiebreakOrder()).to.deep.equal(testData.pg1.tiebreakOrder)
	})
	it('should return the correct tiebreaker order 2', function(){
		expect(phaseGroup2.getTiebreakOrder()).to.deep.equal(testData.pg2.tiebreakOrder)
	})
	it('should return the correct tiebreaker order 3', function(){
		expect(phaseGroup3.getTiebreakOrder()).to.deep.equal(testData.pg3.tiebreakOrder)
	})
	it('should return the correct tiebreaker order 4', function(){
		expect(phaseGroup4.getTiebreakOrder()).to.deep.equal(testData.pg4.tiebreakOrder)
	})

	
	// entrants
	it('should return the correct entrants 1', async function(){
		this.timeout(30000)

		let entrants: Entrant[] = await phaseGroup1.getEntrants();
		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(entrant => {
			expect(entrant).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(26);
		return true;
	})
	it('should return the correct entrants 2', async function(){
		this.timeout(30000)

		let entrants: Entrant[] = await phaseGroup2.getEntrants();
		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(entrant => {
			expect(entrant).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(12);
		return true;
	})
	it('should return the correct entrants 3', async function(){
		this.timeout(30000)

		let entrants: Entrant[] = await phaseGroup3.getEntrants();
		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(entrant => {
			expect(entrant).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(46);
		return true;
	})
	it('should return the correct entrants 4', async function(){
		this.timeout(30000)

		let entrants: Entrant[] = await phaseGroup4.getEntrants();
		var hasDuplicates = function(a: Entrant[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(entrants)).to.be.false;
		entrants.forEach(entrant => {
			expect(entrant).to.be.an.instanceof(Entrant);
		});
		expect(entrants.length).to.be.equal(75);
		return true;
	})
	

	// set
	it('should return the correct Sets 1', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await phaseGroup1.getSets()
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(42);
		return true;
	})
	it('should return the correct Sets 2', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await phaseGroup2.getSets()
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(14);
		return true;
	})
	it('should return the correct Sets 3', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await phaseGroup3.getSets()
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(70);
		return true;
	})
	it('should return the correct Sets 4', async function(){
		this.timeout(30000)

		let sets: GGSet[] = await phaseGroup4.getSets()
		var hasDuplicates = function(a: GGSet[]) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(sets)).to.be.false;
		sets.forEach(set => {
			expect(set).to.be.an.instanceof(GGSet);
		});
		expect(sets.length).to.be.equal(42);
		return true;
	})

	/*
	id: number
	phaseId: number
	displayIdentifier: string | null
	firstRoundTime: number | null
	state: number | null
	waveId: number | null
	tiebreakOrder: object | null

	/*
	it('should correctly return the phase id', function(){
		let phaseId1 = phaseGroup3.getPhaseId()
		expect(phaseId1).to.be.equal(100046)
	})

	it('should get all entrants', async function(){
		this.timeout(5000)

		let players = await phaseGroup3.getPlayers()
		expect(players.length).to.be.equal(15)
		return true
	})

	it('should get all sets', async function(){
		this.timeout(5000)

		let sets = await phaseGroup3.getSets()
		expect(sets.length).to.be.equal(27)
		return true
	})

	it('should get sets completed within x minutes ago', async function(){
		this.timeout(5000)

		let clock = sinon.useFakeTimers(new Date('Sat Nov 11 2017 11:50:47 GMT-0500 (EST)'))
		let sets = await phaseGroup3.getSetsXMinutesBack(5)

		expect(sets.length).to.be.equal(4)
		sets.forEach(set => {
			expect(set).to.be.instanceof(GGSet);
		})

		clock.restore()
		return true
	})
	*/
})