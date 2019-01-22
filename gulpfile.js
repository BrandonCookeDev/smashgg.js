'use strict'

const path = require('path')
const gulp = require('gulp')
const ts = require('gulp-typescript')
const mocha = require('gulp-mocha')

const ROOT = __dirname
const SRC_DIR = path.join(ROOT, 'src')
const TS_DIR = path.join(SRC_DIR, 'ts')
const JS_DIR = path.join(SRC_DIR, 'js')
const DIST_DIR = path.join(ROOT, 'dist')
const TEST_DIR = path.join(JS_DIR, 'test')

function test(){
	return gulp.src(TEST_DIR)
		.pipe(mocha())
}

function tsc(){
	return gulp.src(TS_DIR)
		.pipe(ts({
			rootDir: TS_DIR,
			outDir: JS_DIR,
			target: 'ES5',
			module: 'commonjs',
			lib: [
				'dom',
				'es2017'
			],  
			strict: true,
			esModuleInterop: true
		}))
		.pipe(gulp.dest(JS_DIR))
}

function createDTs(){
	return gulp.src(TS_DIR)
		.pipe(ts({
			outFile: 'smashgg.js',
			declaration: true
		}))
		.pipe(gulp.dest(__dirname))
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