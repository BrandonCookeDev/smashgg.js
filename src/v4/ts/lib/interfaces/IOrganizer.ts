// Organizer is just a User
export interface IOrganizer{
	/*
	id: number | null
	phone: string | null
	twitter: string | null
	info: string | null
	*/
	
	getId(): number | null
	getBio(): string | null
	getGenderPronoun(): string | null
	getGamerTag(): string | null
}

export interface IOrganizerData {
		tournament: {
		    owner: {
		        id: number,
		        bio: string | null,
		        genderPronoun: string | null,
		        player: {
		            gamerTag: string | null
	            }
            }
        }
}