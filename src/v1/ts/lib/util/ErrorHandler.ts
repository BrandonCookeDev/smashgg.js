import 'colors'
import { EventEmitter } from 'events'

function errHandle(e: Error) : void{
	console.error(e.message.red)
	console.error(e)

}

(process as EventEmitter).on('error', errHandle)
process.on('unhandledRejection', errHandle)
process.on('uncaughtException', errHandle)