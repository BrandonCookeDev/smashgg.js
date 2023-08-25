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
teamManagementDeadline
`

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
    id
    name
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
genderPronoun
name
player{
id
gamerTag
prefix
}
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
zipcode
`

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
event{
    id
}
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
    seed{
        id
        placement
        seedNum
     }
    slotIndex
    standing
}
`

export const set = `
id
completedAt
displayScore  
event{
    id
}
fullRoundText
identifier
phaseGroup{
    id
}
round
startedAt
slots{
         id
         entrant {
             id
             name
             participants {
                 id
             }
         }
     }
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
	entrant {
	    id
	}
	participant {
	    id
	}
}
state
winnerId
`

export const seeds = `
id
entrant{
    id
}
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

// Subset of User for Organizer info
export const organizer = `
id
bio
genderPronoun
player {
    gamerTag
}
`

export const streams = `
id
enabled
followerCount
isOnline
numSetups
parentStreamId
streamGame
streamId
streamLogo
streamName
streamSource
streamStatus
streamType
streamTypeId
`

/*Classes finished updating:
* Seed,
*/