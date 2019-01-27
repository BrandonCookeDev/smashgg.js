
export namespace IOrganizer{
	export interface Organizer{
		id: number
		email: string
		phone: string
		twitter: string
		info: string

		getId(): number
		getEmail(): string
		getPhone(): string
		getTwitter(): string
		getInfo(): string
	}
}

export class Organizer implements IOrganizer.Organizer{
	
	id: number
	email: string
	phone: string
	twitter: string
	info: string

	constructor(id: number, email: string, phone: string, twitter: string, info: string){
		this.id = id
		this.email = email
		this.phone = phone
		this.twitter = twitter
		this.info = info
	}

	getId() {
	  return this.id
	}

	getEmail() {
		return this.email
	}
	
	getPhone() {
	  return this.phone
	}
	
	getTwitter() {
		return this.twitter
	}

	getInfo() {
	  return this.info
	}
	

}