import * as Schema from './schema'

export const set = `query SetQuery($id: ID!){
	set(id:$id){
		${Schema.set}
	}
}
`

export const games = `query SetQuery($id: ID!){
	set(id:$id){
		games{
			${Schema.game}
		}
	}
}
`

export const entrants = `query SetParticipants($id: ID!){
	set(id: $id){
		slots{
			entrant{
				${Schema.entrant}
			}
		}
	}
}
`

export const attendees = `query SetParticipants($id: ID!){
	set(id: $id){
		slots{
			entrant{
				participants{
					${Schema.attendee}
				}
			}
		}
	}
}`
