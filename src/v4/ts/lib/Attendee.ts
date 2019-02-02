/** aka Participant **/

export class Attendee implements IAttendee.Attendee{

}

export namespace IAttendee{
	export interface Attendee{
		id: number,
		connectedAccounts: object,
		
	}
}