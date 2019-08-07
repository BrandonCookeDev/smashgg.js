
export interface IOrganizer{
	/*
	id: number | null
	email: string | null
	phone: string | null
	twitter: string | null
	info: string | null
	*/
	
	getId(): number | null
	getEmail(): string | null
	getPhone(): string | null
	getTwitter(): string | null
	getInfo(): string | null
}

export interface IOrganizerData{
	data: {
		tournament: {
			ownerId: number
			contactEmail: string
			contactPhone: string
			contactTwitter: string
			contactInfo: string
		}
	}
}
