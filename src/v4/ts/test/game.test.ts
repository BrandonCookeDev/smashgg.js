import path from 'path'
const ROOT = path.join(__dirname, '..', '..', '..', '..', '.env');
import {config} from 'dotenv'
config({path: ROOT})

import sinon from 'sinon'
import {expect, assert} from 'chai'
import {Game} from '../lib/Game'
import Initializer from '../lib/util/Initializer'

import * as testData from './data/player.testData';
let games1: Game, game2: Game, game3: Game

describe('smash.gg Game', function(){
	before(async function(){
		await Initializer(process.env.API_TOKEN!)
		games1
	})
})