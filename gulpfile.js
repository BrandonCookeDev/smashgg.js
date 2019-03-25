'use strict'

const path = require('path')
const gulp = require('gulp')
const ts = require('gulp-typescript')
const mocha = require('gulp-mocha')
const {exec} = require('child_process')

const ROOT = __dirname
const SRC_DIR = path.join(ROOT, 'src', 'v4')
const TS_DIR = path.join(SRC_DIR, 'ts')
const JS_DIR = path.join(SRC_DIR, 'js')
const TEST_DIR = path.join(JS_DIR, 'test')

const tsProd = ts.createProject('tsconfig.json')

function tsc(){
	return gulp.src(TS_DIR + '/**/*.ts')
		.pipe(tsProd())
		.pipe(gulp.dest(JS_DIR))
}

function createDTs(){
	return gulp.src(TS_DIR + '/**/*.ts')
		.pipe(ts({
			outFile: 'smashgg.js',
			declaration: true
		}))
		.pipe(gulp.dest(__dirname))
}

function test(){
	return gulp.src(TEST_DIR)
		.pipe(mocha())
}

function testTournament(){
	return gulp.src(path.join(TEST_DIR, 'tournament.test.js'))
		.pipe(mocha())
}

function testEvent(){
	return gulp.src(path.join(TEST_DIR, 'event.test.js'))
		.pipe(mocha())
}

function testPhase(){
	return gulp.src(path.join(TEST_DIR, 'phase.test.js'))
		.pipe(mocha())
}

function testPhaseGroup(){
	return gulp.src(path.join(TEST_DIR, 'phaseGroup.test.js'))
		.pipe(mocha())
}

function testCache(){
	return gulp.src(path.join(TEST_DIR, 'testZCache.js'))
		.pipe(mocha())
}
function testUser(){
	return gulp.src(path.join(TEST_DIR, 'user.test.js'))
		.pipe(mocha())
}
function testAttendee(){
	return gulp.src(path.join(TEST_DIR, 'attendee.test.js'))
		.pipe(mocha())
}
function testPlayer(){
	return gulp.src(path.join(TEST_DIR, 'player.test.js'))
		.pipe(mocha())
}
function testSet(){
	return gulp.src(path.join(TEST_DIR, 'set.test.js'))
		.pipe(mocha())
}
function testGame(){
	return gulp.src(path.join(TEST_DIR, 'game.test.js'))
		.pipe(mocha())
}
function testStream(){
	return gulp.src(path.join(TEST_DIR, 'stream.test.js'))
		.pipe(mocha())
}
function testStreamQueue(){
	return gulp.src(path.join(TEST_DIR, 'streamQueue.test.js'))
		.pipe(mocha())
}

function testV1(){
	return gulp.src(path.join(ROOT, 'src', 'v1', 'js', 'test'))
		.pipe(mocha())
}

function sandbox(){
	require('./sandbox/sandbox')
}

function watch(){
	return gulp.watch(TS_DIR + '/**/*.ts', gulp.parallel(tsc))
}

function publish(cb){
	exec('npm publish', (err, stdout, stderr) => {
		console.out(stdout)
		console.error(stderr)
		cb(err)
	})
}

function getQueries(cb){
	let queries = require('./src/v4/js/lib/scripts/schema')
	for(var prop in queries){
		console.log('=================')
		console.log(prop)
		console.log('----------')
		console.log(queries[prop])
		console.log('=================')
	}
	cb(null)
}

exports.test = gulp.series(tsc, test)
exports.testTournament = gulp.series(tsc, testTournament)
exports.testEvent = gulp.series(tsc, testEvent)
exports.testPhase = gulp.series(tsc, testPhase)
exports.testPhaseGroup = gulp.series(tsc, testPhaseGroup)
exports.testCache = gulp.series(tsc, testCache)
exports.testPlayer = gulp.series(tsc, testPlayer)
exports.testSet = gulp.series(tsc, testSet)
exports.testGame = gulp.series(tsc, testGame)
exports.testUser = gulp.series(tsc, testUser)
exports.testAttendee = gulp.series(tsc, testAttendee)
exports.testPlayer = gulp.series(tsc, testPlayer)
exports.testStream = gulp.series(tsc, testStream)
exports.testStreamQueue = gulp.series(tsc, testStreamQueue)
exports.testV1 = testV1

exports.tsc = tsc
exports.createDTs = createDTs
exports.watch = watch
exports.sandbox = gulp.series(tsc, sandbox)
exports.getQueries = getQueries
exports.publish = gulp.series(tsc, publish)