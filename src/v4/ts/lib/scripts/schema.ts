export const tournament = `
id
addrState
city
countryCode
endAt
isRegistrationOpen
lat
lng
name
numAttendees
owner{
    id
    discriminator
    email
    name
}
postalCode
streams{
    id
    streamName
}
slug
startAt
timezone
venueAddress
venueName
`

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
event{
    id
    name
    slug
}
groupCount
name
numSeeds
waves{
    id
    identifier
    startAt
}
`

export const phaseGroup = `
id
displayIdentifier
firstRoundTime
phase{
    ${phase}
}
state
tiebreakOrder
wave{
    id
    identifier
    startAt
}
`

export const user = `
id
bio
discriminator
email
name
player
slug
`

// start.gg participant
export const attendeeContactInfo = `
id
city
country
countryId
name
nameFirst
nameLast
state
stateId
zipcode`

// start.gg participant
export const attendee = `
id
checkedIn
connectedAccounts
contactInfo{
	${attendeeContactInfo}
}
events{
	id
}
gamerTag
prefix
user{
    ${user}
}
verified
`

export const entrant = `
id
eventId
name
participants{
	${attendee}	
}
skill
`

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
    seed
    slotIndex
}`

export const set = `
id
completedAt
displayScore  
eventId
fullRoundText
phaseGroupId
round
${setSlots}
startedAt
state
totalGames
winnerId
`

export const game = `
id
orderNum
selections{
    id
	selectionType
	selectionValue
}
state
winnerId
`

export const seeds = `
id
entrantId
isBye
placeholderName
placement
players{
	id
    gamerTag
}
seedNum
standings(containerType:null){
    id
    placement
}
`

export const standings = `
id
entrant{
    id
    name
}
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

export const streams = `
id
enabled
followerCount
isOnline
numSetups
streamGame
streamName
streamLogo
streamStatus
streamSource
streamType
streamTypeId
`
