export const tournament = `
id
name
slug
city
postalCode
addrState
countryCode
region
venueAddress
venueName
gettingThere
lat
lng
timezone
startAt
endAt
contactInfo
contactEmail
contactTwitter
contactPhone
ownerId`

export const event = `
id
name
slug
state
startAt
numEntrants
checkInBuffer
checkInDuration
checkInEnabled
isOnline
teamNameAllowed
teamManagementDeadline`

export const phase = `id
name
numSeeds
groupCount`

export const phaseGroup = `id
displayIdentifier
firstRoundTime
state
phaseId
waveId
tiebreakOrder`


// smash.gg participant
export const attendeeContactInfo = `
id
city
state
stateId
country
countryId
name
nameFirst
nameLast
zipcode`

// smash.gg participant
export const attendee = `
id
gamerTag
prefix
createdAt
claimed
verified
playerId
phoneNumber
contactInfo{
	${attendeeContactInfo}
}
connectedAccounts
events{
	id	
}`


export const player = `
id
name
eventId
skill
participants{
	${attendee}	
}`

export const user = `
id
gamerTag
prefix
color
twitchStream
twitterHandle
youtube
region
state
country
gamerTagChangedAt`

export const set = `
id
eventId
phaseGroupId
displayScore  
fullRoundText
round
startedAt
completedAt
winnerId
totalGames
state
slots(includeByes:false){
	id
	entrant {
		id
		name
		participants {
			id
		}
	}
}`

export const game = `
id
state
winnerId
orderNum
selections{
	selectionType
	selectionValue
	entrantId
	participantId
}`