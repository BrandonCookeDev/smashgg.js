import IMock from './IMock'
import {SinonSandbox} from 'sinon'

export default class Mock implements IMock{
	protected sandbox: SinonSandbox

	constructor(sandbox: SinonSandbox){
		if(!sandbox)
			this.throwIllegalArgumentErrorForSandbox()
		this.sandbox = sandbox
	}

	public validateSandbox(): void {
		if(!this.sandbox)
			this.throwNoSandboxError()
	}

	public resetSandbox(): void{
		if(this.sandbox)
			this.sandbox.restore()
	}

	public mock(): void{
		throw new Error('NotImplementedError: mock function')
	}

	public mockQueries(): void{
		throw new Error('NotImplementedError: mockQueries function')
	}

	protected throwNoSandboxError(): void{
		throw new Error('NoSandboxError: sandbox cannot be null!')
	}

	protected throwIllegalArgumentErrorForSandbox(){
		throw new Error('IllegalArgumentError: sandbox cannot be null coming into a mock')
	}
}
