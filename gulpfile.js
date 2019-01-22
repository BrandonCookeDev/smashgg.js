'use strict'

const path = require('path')
const gulp = require('gulp')
const ts = require('gulp-typescript')
const mocha = require('gulp-mocha')

const ROOT = __dirname
const SRC_DIR = path.join(ROOT, 'src')
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
	return gulp.src(TEST_DIR, 'testTournament.js')
		.pipe(mocha())
}

function testEvent(){
	return gulp.src(TEST_DIR, 'testEvent.js')
		.pipe(mocha())
}

function testPhase(){
	return gulp.src(TEST_DIR, 'testPhase.js')
		.pipe(mocha())
}

function testPhaseGroup(){
	return gulp.src(TEST_DIR, 'testPhaseGroup.js')
		.pipe(mocha())
}

function testCache(){
	return gulp.src(TEST_DIR, 'testZCache.js')
		.pipe(mocha())
}
function testPlayer(){
	return gulp.src(TEST_DIR, 'testPlayer.js')
		.pipe(mocha())
}
function testSet(){
	return gulp.src(TEST_DIR, 'testSet.js')
		.pipe(mocha())
}

function watch(){
	return gulp.watch(TS_DIR + '/**/*.ts', gulp.parallel(tsc))
}

exports.test = test
exports.testTournament = testTournament
exports.testEvent = testEvent
exports.testPhase = testPhase
exports.testPhaseGroup = testPhaseGroup
exports.testCache = testCache
exports.testPlayer = testPlayer
exports.testSet = testSet
exports.tsc = tsc
exports.createDTs = createDTs
exports.watch = watch