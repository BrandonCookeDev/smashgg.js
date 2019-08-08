import 'colors'
import { EventEmitter } from 'events'
import {default as Log} from './Logger'

function errHandle(e: Error): void{
	Log.error(e.message.red)
	Log.error(e)
}

(process as EventEmitter).on('error', errHandle)
process.on('unhandledRejection', errHandle)
process.on('uncaughtException', errHandle)
