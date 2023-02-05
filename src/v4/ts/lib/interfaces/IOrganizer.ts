// Organizer is just a User
export interface IOrganizer{
	/*
	id: number | null
	email: string | null
	phone: string | null
	twitter: string | null
	info: string | null
	*/
	
	getId(): number | null
	getBio(): string | null
	getEmail(): string | null
	getGenderPronoun(): string | null
	getGamerTag(): string | null
}

export interface IOrganizerData {
		tournament: {
		    owner: {
		        id: number,
		        bio: string | null,
		        email: string | null,
		        genderPronoun: string | null,
		        player: {
		            gamerTag: string | null
	            }
            }
        }
}