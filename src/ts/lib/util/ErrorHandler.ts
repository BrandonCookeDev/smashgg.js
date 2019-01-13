import 'colors'

function errHandle(e: Error) : void{
	console.error(e.message.red)
	console.error(e)

}

process.on('unhandledRejection', errHandle)
process.on('uncaughtException', errHandle)