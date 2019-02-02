import 'colors'
import Cache from './Cache'
import TokenHandler from './TokenHandler'
import NI from './NetworkInterface'
import SRQ from './StaggeredRequestQueue'
import log from 'winston'

function handleErrors(e: Error) : void{
	console.error(e.message.red)
	console.error('NOTE: Check your debug log for stack trace'.grey)
	log.debug(e)
}

export default function(token: string){
	//process.on('error', handleErrors)
	(process as NodeJS.EventEmitter).on('error', handleErrors);
	process.on('unhandledRejection', handleErrors)
	process.on('uncaughtException', handleErrors)

	TokenHandler.setToken(token)
	Cache.init()
	NI.init()
	SRQ.init()
}