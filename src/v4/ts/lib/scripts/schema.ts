export const tournament = `
id
name
slug
city
postalCode
addrState
countryCode
venueAddress
venueName
lat
lng
timezone
startAt
endAt`

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

export const phase = `
id
name
numSeeds
groupCount`

export const phaseGroup = `
id
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

export const entrant = `
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

export const setSlots = `
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
${setSlots}
`

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

export const seeds = `
id
entrantId
placeholderName
seedNum
placement
isBye
players{
	id
}`

export const standings = `
id
entrantId
placeholderName
seedNum
placement
isBye
players{
	id
}
standings{
	stats{
		score{
			label
			value
		}
	}
}`

export const venue = `
venueName
venueAddress
city
addrState
countryCode`

export const organizer = `
ownerId
contactEmail
contactTwitter
contactPhone
contactInfo`

export const stream = `
id
eventId
tournamentId
streamName
numSetups
streamSource
streamType
streamTypeId
isOnline
enabled
followerCount
removesTasks
streamStatus
streamGame
streamLogo`
