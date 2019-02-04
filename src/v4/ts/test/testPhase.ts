/* eslint-disable */
import '../lib/util/ErrorHandler'

import _ from 'lodash'
import moment from 'moment'
import sinon from 'sinon'
import chai from 'chai'
import cap from 'chai-as-promised'
chai.use(cap)
const {expect} = chai

import {Event, Phase, PhaseGroup, IPhase, GGSet, Entrant} from '../lib/internal'
import Cache from '../lib/util/Cache'

import expected from './data/testSets'


let ID1 = 111483
let ID2 = 45262
let ID3 = 100046

let phase1: Phase; 
let phase2: Phase; 
let phase3: Phase;
let concurrency = 4;


function loadPhase(id: number, options: IPhase.Options) : Promise<Phase>{
	return new Promise(function(resolve, reject){
		let P = new Phase(id, options)
		P.on('ready', function(){
			resolve(P)
		})
	})
}

describe('Smash GG Phase', function(){

	before( () => console.log('concurrency set to %s', concurrency) )

	beforeEach(function(){
		Cache.flush()
	})

	it('should correctly load the Phase', async function(){
		this.timeout(10000)

		phase1 = await loadPhase(ID1, {rawEncoding: 'utf8'});
		phase2 = await loadPhase(ID2, {});
		phase3 = await loadPhase(ID3, {rawEncoding: 'base64'});
		return true;
	});

	it('should implement the convenience methods correctly', async function(){
		this.timeout(10000)

		let cPhase1 = await Phase.getPhase(ID1, {rawEncoding: 'utf8'})
		let cPhase2 = await Phase.getPhase(ID2)
		let cPhase3 = await Phase.getPhase(ID3, {rawEncoding: 'base64'})

		expect(cPhase1.data).to.deep.equal(phase1.data)
		expect(cPhase2.data).to.deep.equal(phase2.data)
		expect(cPhase3.data).to.deep.equal(phase3.data)

		return true
	})

	it('should get the name of the Phase', function(done){
		expect(phase1.getName()).to.be.equal('Pools')
		expect(phase2.getName()).to.be.equal('Pools')
		expect(phase3.getName()).to.be.equal('Bracket Pools')
		done()
	})

	it('should get the event id', function(done){
		expect(phase1.getEventId()).to.be.equal(25545)
		expect(phase2.getEventId()).to.be.equal(11787)
		expect(phase3.getEventId()).to.be.equal(23596)
		done()
	})

	it('should correctly get all phase groups', async function(){
		this.timeout(45000)

		let phaseGroups1 = await phase1.getPhaseGroups({concurrency: concurrency});

		expect(phaseGroups1.length).to.be.equal(16);

		var hasDuplicates = function(a: Array<PhaseGroup>) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(phaseGroups1)).to.be.false;

		phaseGroups1.forEach(set => {
			expect(set).to.be.an.instanceof(PhaseGroup);
		});

		return true;
	});

	it('should correctly get all phase groups 2', async function(){
		this.timeout(45000);
		
		let phaseGroups2 = await phase2.getPhaseGroups({concurrency: concurrency});

		expect(phaseGroups2.length).to.be.equal(32);

		var hasDuplicates = function(a: Array<PhaseGroup>) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(phaseGroups2)).to.be.false;

		phaseGroups2.forEach(set => {
			expect(set).to.be.an.instanceof(PhaseGroup);
		});

		return true
	})

	it('should correctly get all phase groups 3', async function(){
		this.timeout(45000);
		
		let phaseGroups3 = await phase3.getPhaseGroups({concurrency: concurrency});

		expect(phaseGroups3.length).to.be.equal(16);

		var hasDuplicates = function(a: Array<PhaseGroup>) {
			return _.uniq(a).length !== a.length;
		};
		expect(hasDuplicates(phaseGroups3)).to.be.false;

		phaseGroups3.forEach(set => {
			expect(set).to.be.an.instanceof(PhaseGroup)
		})

		return true;
	})

	it('should correctly get all sets for a phase', async function(){
		this.timeout(30000)

		let sets1 = await phase1.getSets({concurrency: concurrency});

		expect(sets1.length).to.be.equal(248);

		sets1.forEach(set => {
			expect(set).to.be.instanceof(GGSet);
		})

		return true;
	})

	xit('should correctly get all sets for a phase 2', async function(){
		this.timeout(45000);
		
		let sets2 = await phase2.getSets({concurrency: concurrency});

		expect(sets2.length).to.be.equal(1292);

		sets2.forEach(set => {
			expect(set).to.be.instanceof(GGSet);
		})

		return true;
	})

	it('should correctly get all sets for a phase 3', async function(){
		this.timeout(45000);
		
		let sets3 = await phase3.getSets({concurrency: concurrency});

		expect(sets3.length).to.be.equal(450);

		sets3.forEach(set => {
			expect(set).to.be.instanceof(GGSet);
		})

		return true
	})

	it('should correctly get all players for a phase', async function(){
		this.timeout(30000)
		
		let players1 = await phase1.getPlayers({concurrency: concurrency});

		expect(players1.length).to.be.equal(156);

		players1.forEach(set => {
			expect(set).to.be.instanceof(Entrant)
		})

		return true;
	})

	it('should correctly get all players for a phase', async function(){
		this.timeout(30000);
		
		let players2 = await phase2.getPlayers({concurrency: concurrency});

		expect(players2.length).to.be.equal(678);

		players2.forEach(set => {
			expect(set).to.be.instanceof(Entrant)
		})

		return true
	})

	it('should correctly get sets x minutes back', async function(){
		this.timeout(30000)

		let minutesBack = 5;
		let event = await Event.getEventById(phase1.getEventId(), {});
		let eventDate = moment(event.getStartTime() as Date).add(30, 'minutes').toDate();

		let clock = sinon.useFakeTimers(eventDate)
		let sets = await phase1.getSetsXMinutesBack(minutesBack)
		expect(sets.length).to.be.equal(5)
		sets.forEach(set=> {
			expect(set).to.be.instanceof(GGSet);

			let now = moment();
			let then = moment(set.getCompletedAt() as Date);
			let diff = moment.duration(now.diff(then)).minutes();
			expect(diff <= minutesBack && diff >= 0 && set.getIsComplete()).to.be.true;
		})
		clock.restore()
		return true
	})
})