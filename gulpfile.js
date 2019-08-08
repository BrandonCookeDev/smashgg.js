'use strict'
require('colors')

const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const ts = require('gulp-typescript')
const mocha = require('gulp-mocha')
const {exec} = require('child_process')
const {format} = require('util')
const readline = require('readline')

const ROOT = __dirname
const SRC_DIR = path.join(ROOT, 'src', 'v4')
const TS_DIR = path.join(SRC_DIR, 'ts')
const JS_DIR = path.join(SRC_DIR, 'js')
const TEST_DIR = path.join(JS_DIR, 'test')
const V1_DIR = path.join(ROOT, 'src', 'v1')
// const V1_JS_DIR = path.join(V1_DIR, 'js')

const tsProd = ts.createProject('tsconfig.json')
// const tsV1 = ts.createProject(path.join(V1_DIR, 'tsconfig.json'))

function tsc(){
	return gulp.src(TS_DIR + '/**/*.ts')
		.pipe(tsProd())
		.pipe(gulp.dest(JS_DIR))
}

function tscV1(cb){
	const cmd = `cd ${V1_DIR} && tsc`
	exec(cmd, cb)
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
		console.log(stdout)
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

function deploymentWarningMessage(cb){
	const message = format(
		'%s: %s', 
		'WARNING'.red, 
		'Before deployment, please commit your code and make sure you are logged into git and npm'
	)
	console.log(message)

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})

	rl.question('Do you wish to proceed? [y]', (answer) => {
		rl.close()
		if(answer != null && answer.toString().toLowerCase() == 'y')
			cb()
		else
			cb(new Error('Deployment Cancelled'))
	})
}

function updateMajor(cb){
	updatePackageJsonVersion(1)
	cb()
}

function updateMinor(cb){
	updatePackageJsonVersion(0, 1)
	cb()
}

function updatePatch(cb){
	updatePackageJsonVersion(0, 0, 1)
	cb()
}

function gitTag(cb){
	const version = getVersionFromPackageJson()
	const cmd = `git tag ${version}`
	exec(cmd, cb)
}

function gitCommit(cb){
	const version = getVersionFromPackageJson()
	const cmd = `git commit -m "${version}"`
	exec(cmd, cb)
}

function npmPublish(cb){
	const cmd = 'npm publish'
	exec(cmd, cb)
}


function getVersionFromPackageJson(){
	const packageJsonPath = path.join(__dirname, 'package.json')
	const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8')
	const versionRegex = new RegExp(/("version"[\s]*:[\s]*"([0-9]+.[0-9]+.[0-9])")/)

	if(!versionRegex.test(packageJsonContent))
		throw new Error('No version property in package json')

	const currentVersionMatch = versionRegex.exec(packageJsonContent)
	return currentVersionMatch[2]
}

function updatePackageJsonVersion(majorIncrement=0, minorIncrement=0, patchIncrement=0){
	if(majorIncrement == 0 && minorIncrement == 0 && patchIncrement == 0)
		throw new Error('must have at least one incremented version number')

	const packageJsonPath = path.join(__dirname, 'package.json')
	const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8')
	const versionRegex = new RegExp(/("version"[\s]*:[\s]*"([0-9]+.[0-9]+.[0-9])")/)
	const majMinPatchRegex = new RegExp(/([0-9]+).([0-9]+).([0-9]+)/)

	if(!versionRegex.test(packageJsonContent))
		throw new Error('No version property in package json')

	const currentVersionMatch = versionRegex.exec(packageJsonContent)
	const currentVersion = majMinPatchRegex.exec(currentVersionMatch[2])

	let major = parseInt(currentVersion[1]) + majorIncrement
	let minor = parseInt(currentVersion[2]) + minorIncrement
	let patch = parseInt(currentVersion[3]) + patchIncrement

	const newVersion = `${major}.${minor}.${patch}`
	const replacement = `"version": "${newVersion}"`
	const newContent = packageJsonContent.replace(versionRegex, replacement)

	fs.writeFileSync(packageJsonPath, newContent, 'utf8')
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
exports.tscV1 = tscV1
exports.createDTs = createDTs
exports.watch = watch
exports.sandbox = gulp.series(tsc, sandbox)
exports.getQueries = getQueries
exports.publish = gulp.series(tsc, publish)

// exports.updateMajor = updateMajor
// exports.updateMinor = updateMinor
// exports.updatePatch = updatePatch
exports.preDeploy = gulp.series(deploymentWarningMessage, tsc, tscV1)
exports.deployPatch = gulp.series(this.preDeploy, updatePatch, gitTag, gitCommit, npmPublish)
exports.deployMinor = gulp.series(this.preDeploy, updateMinor, gitTag, gitCommit, npmPublish)
exports.deployMajor = gulp.series(this.preDeploy, updateMajor, gitTag, gitCommit, npmPublish)