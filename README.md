# <img src="resources/images/smashgg.png" height="75" width="75" alt="smash.gg logo" /> **smashgg.js**

![node version](https://shields-staging.herokuapp.com/node/v/smashgg.js.svg)
![package version](https://img.shields.io/npm/v/smashgg.js.svg) 
![downloads](https://img.shields.io/npm/dt/smashgg.js.svg) 
![last commit](https://img.shields.io/github/last-commit/BrandonCookeDev/smashgg.js/master.svg)
![minizipp size](https://img.shields.io/bundlephobia/minzip/smashgg.js.svg)
![repo size](https://img.shields.io/github/repo-size/BrandonCookeDev/smashgg.js.svg)
![license](https://img.shields.io/npm/l/smashgg.js.svg)

Node.js SDK for the public Smash.gg API, which is rich
with data about tournament brackets that have occurred on their platform.

![example](resources/images/smashgg.js.jpg)

[See the full sample code](https://github.com/BrandonCookeDev/smashgg.js/blob/master/resources/samples/sample1.js)

## Author: Brandon Cooke
* Organization: [RecursionGG](http://recursion.gg)
* Email: BrandonCookeDev@gmail.com
* Discord: cookiE#7679

## Installation
```bash
npm install --save smashgg.js
```

## Issues
* Please submit any issues or feature requests to the [Issues Section of the Github](https://github.com/BrandonCookeDev/smashgg.js/issues)

## Contents
- [Logging](#logging)
- [Docs](#docs)
    -  [Tournament](#tournament)
    -  [Event](#event)
    -  [Phase](#phase)
    -  [PhaseGroup](#phasegroup)
    -  [User](#user)
    -  [Attendee](#attendee)
    -  [Entrant](#entrant)
    -  [GGSet](#ggset)
    -  [Stream](#stream)
    -  [StreamQueue](#streamqueue)
    -  [Character](#character)
    -  [VideoGame](#videogame)
- [Upgrading](#upgrading)

## Logging
### Winston
You can access the built in Winston logger by using the following methods
```javascript
const smashgg = require('smashgg.js');
let log = smashgg.Log;

log.info('Here\'s some text')
log.debug('Don\'t print this here')

smashgg.setLogLevel('debug')
log.info('Print everything now!!')
log.verbose('Not to be verbose...')
log.debug('but i\'m trying to debug :)')

smashgg.setLogLevel('warn');
```
You can also add a Logger of your own, say if you'd like a File logger added
```javascript
const smashgg = require('smashgg.js')
let log = smashgg.Log

smashgg.addLog('file', {
    filename: '/tmp/log',
    level: 'verbose',
    format: winston.format.combin(
        winston.format.splat(),
        winston.format.simple()
    )
})
```

The following are the operations at your disposal

* **setLogLevel(level)**
    * level: string
        * Valid values are
            * error
            * warn
            * info
            * verbose
            * debug 

* **addLog(type, options)**    
    * type: string
        * valid values:
            * console
            * file
    * options: winston.LoggerOptions
        * if you need this, please see [this link](https://github.com/winstonjs/winston#creating-your-own-logger)

* **disableLog()**
    * disabled the embedded logger

* **enableLog()**
    * enables the embedded logger

# Docs
## Tournament
A Tournament in smash.gg is a collection of Events, Phases, and Phases Groups that
categorize different games played, game types within those games, and the matches that
make up those games.

```javascript
const smashgg = require('smashgg.js');
const Tournament = smashgg.Tournament;
(async function(){
    let ceo2016 = await Tournament.getTournament('ceo2016');
    console.log(ceo2016.getName());
    
    let ceoEvents = await Tournament.getEvents();
    let phases = await Tournament.getPhases();
    let phaseGroups = await Tournament.getPhaseGroups();
})();
```

### Constructor
```js
Tournament(
    id: number,
    name: string,
    slug: string,
    startTime: Date | null,
    endTime: Date | null,
    timezone: string | null,
    venue: Venue,
    organizer: Organizer
)
```

### Properties
* **id** 
    * number
    * id number of the tournament
* **name** 
    * string
    * name of the tournament
* **slug** 
    * string
    * url slug of the tournament
* **startTime** 
    * Date | null
    * start time unix epoch of the tournament
* **endTime** 
    * Date | null
    * end time unix epoch of the tournament
* **timezone** 
    * string | null
    * timezone of the location of the tournament
* **venue** 
    * [Venue](#venue)
    * contains information about the Venue (see Venue docs) 
* **organizer** 
    * [Organizer](#organizer)
    * contains information about the Organizer (see Organizer docs)

#### Getters
* **getId()** 
    * gets the id property of the tournament
    * returns number
* **getName()** 
    * gets the name property of the tournament
    * returns string 
* **getSlug()** 
    * gets the slug property of the tournament
    * returns string
* **getTimezone()** 
    * gets the timezone property of the tournament
    * returns string | null
* **getStartTime()** 
    * gets the start time property of the tournament in JS Date object
    * returns Date | null
* **getStartTimeString()** 
    * gets the start time property of the tournament in Date string
    * returns string | null
* **getEndTime()** 
    * gets the end time property of the tournament in JS Date object
    * returns Date | null
* **getEndTimeString()** 
    * gets the end time property of the tournament in Date string
    * returns string | null
* **getVenue()** 
    * gets the Venue object where this tournament takes place
    * returns [Venue](#venue)
* **getVenueName()** 
    * gets the venue name where this tournament takes place
    * returns string | null
* **getCity()** 
    * gets the city string where this tournament takes place
    * returns string | null
* **getState()** 
    * gets the state string where this tournament takes place
    * returns string | null
* **getAddress()** 
    * gets the address string where this tournament takes place
    * returns string | null
* **getZipCode()** 
    * gets the zip code string where this tournament takes place
    * returns string | null
* **getOrganizer()** 
    * gets the Organizer object who organized this tournament
    * returns [Organizer](#organizer)
* **getContactInfo()** 
    * gets the contact info of the organizer
    * returns string | null
* **getContactEmail()** 
    * gets the email string of the organizer
    * returns string | null
* **getContactTwitter()** 
    * gets the twitter handle string of the organizer
    * returns string | null
* **getOwnerId()** 
    * get the numeric id of the owner's player profile
    * returns number | null

* **getEvents()** 
    * aggregates all of the Event objects belonging to the tournament 
    * return Promise<[Event](#event)[]>
* **getPhases()** 
    * aggregates all the Phase objects belonging to the tournament
    * return Promise<[Phase](#phase)[]>
* **getPhaseGroups()** 
    * aggregates all the PhaseGroup objects belonging to the tournament
    * return Promise<[PhaseGroup](#phasegroup)[]>

----

## Venue
A Venue is the location of a tournament, and encapsulates data about that location.

```javascript
let venue = new Venue('Buckhead Theater', '3110 Roswell Rd NE, Atlanta, GA 30305', 'Atlanta', 'GA', '1', 'United States', '30305', 33.8403, 84.3796);

console.log(venue.getName()); // prints "Buckhead Theater"
console.log(venue.getCity()); // prints "Atlanta"
```

### Constructor
```js
Venue(
    name: string | null,
    address: string | null,
    city: string | null,
    state: string | null,
    postalCode: string | null,
    countryCode: string | null,
    region: string | null,
    latitude: number | null,
    longitude: number | null
);
```

### Properties

* **venueName**
    * string | null
* **venueAddress**
    * string | null
* **city**
    * string | null
* **addrState**
    * string | null
* **countryCode**
    * string | null
* **region**
    * string | null
* **postalCode**
    * string | null
* **lat**
    * number | null
* **lng**
    * number | null

### Getters

* **getName()** 
    * get the name string of the venue
    * string | null
* **getAddress()** 
    * get the address of the venue
    * string | null
* **getCity()** 
    * get the city string of the venue
    * string | null
* **getState()** 
    * get the state string of the venue
    * string | null
* **getPostalCode()** 
    * get the postal code string of the venue
    * string | null
* **getCountryCode()** 
    * get the country code string of the venue
    * string | null
* **getRegion()** 
    * get the country region of the venue
    * string | null
* **getLatitude()** 
    * get the numeric latitude of the venue
    * number | null
* **getLongitude()** 
    * get the numeric longitude of the venue
    * number | null

----

## Organizer
An Organizer is an individual or organization in Smash.gg that organizes a tournament and is the owner of a Tournament's webpage in smash.gg

```javascript
let org = new Organizer(7000, 'info@recursion.gg', '123-456-7890', '@recursiongg', 'This is where info goes lul');

console.log(org.getName());
console.log(org.getTwitter());
```

### Constructor
```js
Organizer(
    id: number | null,
    email: string | null,
    phone: string | null,
    twitter: string | null,
    info: string | null
);
```

### Getters
* **getId()**
    * gets the numeric id of the organizer
    * number | null
* **getEmail()**
    * gets the email string of the organizer
    * string | null
* **getPhone()**
    * gets the phone number string of the organizer
    * string | null
* **getTwitter()**
    * gets the twitter handle string of the organizer
    * string | null
* **getInfo()**
    * gets the information string of the organizer
    * string | null

----

## Event
An Event in smash.gg is a broad collection of matches for a single game and game type.
For instance, Melee Singles is an Event while Melee Doubles is another Event. Events
are comprised of optional Phases and Phases Groups.

```javascript
const smashgg = require('smashgg.js');
const Event = smashgg.Event;

(async function(){
    let meleeSinglesAtEvo = await Event.get('evo-2017', 'melee-singles');
    let meleeDoublesAtFunction1 = await Event.get('function-1-recursion-regional', 'melee-doubles');
    let sfvAtEvo = await Event.getById(21726);
    let wiiUAtEvo = await Event.getBySlug('tournament/evo-2017/events/super-smash-bros-for-wii-u');

    let phaseGroups = await meleeSinglesAtEvo.getPhaseGroups();
    let sets = sfvAtEvo.getSets();
})();
```

### Constructor
```js
Event(
    id: number ,
    name: string,
    slug: string,
    state: string | null,
    startAt: number | null,
    numEntrants: number | null,
    checkInBuffer: number | null,
    checkInDuration: number | null,
    checkInEnabled: boolean | null,
    isOnline: boolean | null,
    teamNameAllowed: boolean | null,
    teamManagementDeadline: number | null
)
```

### Properties
* **id**
    * number 
* **name**
    * string
* **slug**
    * string
* **state**
    * string | null
* **startAt**
    * number | null
* **numEntrants**
    * number | null
* **checkInBuffer**
    * number | null
* **checkInDuration**
    * number | null
* **checkInEnabled**
    * boolean | null
* **isOnline**
    * boolean | null
* **teamNameAllowed**
    * boolean | null
* **teamManagementDeadline**
    * number | null

### Methods

* **getId()**
    * gets the numeric identifier for the event
    * returns number
* **getName()**
    * gets the name string for the event
    * returns string
* **getSlug()**
    * gets the name url slug for the event
    * returns string
* **getState()**
    * gets the state string of the event
    * this is the current state of the event
        * eg: 'COMPLETED'
    * returns string | null
* **getNumEntrants()**
    * gets the number of tournament attendees who entered this event
    * returns number | null
* **getCheckInBuffer()**
    * gets the amount of time before check in begins
    * returns number | null
* **getCheckInDuration()**
    * gets the amount of time check in will last
    * returns number | null
* **getCheckInEnabled()**
    * gets the true/false value for if event is doing check-in
    * returns boolean | null
* **getIsOnline()**
    * gets the true/false value for if the event is Online
    * returns boolean | null
* **getTeamNameAllowed()**
    * gets the true/false value for if the event allows team names
    * returns boolean | null
* **getTeamManagementDeadline()**
    * gets the true/false value for if the event has a team management deadline
    * returns number | null

#### Aggregations
* **getPhases()** 
    * gets the Phase objects owned by this Event
    * returns Promise<Phase[]>
* **getPhaseGroups()** 
    * gets the Phase Group that occurred in this event
    * returns Promise<PhaseGroup[]>
* **getEntrants(options: IEntrant.EntrantOptions)** 
    * gets the tournament attendees who competed in this event
    * parameters 
        * options
            * [EntrantOptions](#entrantoptions)
            * series of options for the return set of Entrants
    * returns Promise<Entrant[]>
* **getAttendees(options: IAttendee.AttendeeOptions)**
    * gets the tournament attendees who are in this event
    * parameters
        * options
            * [AttendeeOptions](#attendeeoptions)
            * series of options for the return set of Attendees
    * returns Promise<Attendee[]>
* **getSets(options: IGGSet.SetOptions)**
    * gets the tournament sets that occurred in this event
    * parameters
        * options
            * [SetOptions](#setoptions)
            * series of options for the return set of GGSets
    * returns Promise<GGSet[]>
* **getIncompleteSets(options: IGGSet.SetOptions)**
    * gets the tournament sets in this event that have yet to be completed
    * parameters
        * options
            * [SetOptions](#setoptions)
            * series of options for the return set of GGSets
    * returns Promise<GGSet[]>
* **getCompleteSets(options: IGGSet.SetOptions)**
    * gets the tournament sets in this event that have been completed
    * parameters
        * options
            * [SetOptions](#setoptions)
            * series of options for the return set of GGSets
    * returns Promise<GGSet[]>
* **getSetsXMinutesBack(minutesBack: number, options: IGGSet.SetOptions)**
    * gets the tournament sets in this event that were completed x minutes ago
    * parameters
        * minutesBack
            * number
            * how many minutes ago do you want to search for completed sets
        * options
            * [SetOptions](#setoptions)
            * series of options for the return set of GGSets
    * returns Promise<GGSet[]> 

----

## Phase
A phase in smash.gg is a subset of matches and brackets inside an Event. For example,
a wave in pools is a Phase. Everything in that Phase is a Group (or Phase Group).

```javascript
const smashgg = require('smashgg.js');
const Phase = smashgg.Phase;

(async function(){
    let phase1 = await Phase.get(111483);
    
    console.log(phase1.getName()); // prints "Pools"
    console.log(phase1.getNumSeeds()); // prints 156

    let entrants = await phase1.getEntrants(); 
})()
```

### Constructor
```js
Phase(
    id: number,
    name: string,
    eventId: number,
    numSeeds: number,
    groupCount: number
)
```

### Properties
* **id**
    * number
* **name**
    * string
* **eventId**
    * number
* **numSeeds**
    * number
* **groupCount**
    * number


### Methods
* **getId()**
    * gets the numeric identifier of this phase
    * returns number
* **getEventId()**
    * gets the numeric identifier of the event which owns this phase
    * returns number
* **getName()**
    * gets the name string of the phase
    * returns string
* **getNumSeeds()**
    * gets the number of seeds that are in this phase
    * returns number
* **getGroupCount()**
    * gets the number of phase groups belonging to this phase
    * returns number	

* **getPhaseGroups()**
    * gets the phase groups belonging to this phase
    * returns: Promise<[PhaseGroup](#phasegroup)[]>
* **getEntrants(options: IEntrant.EntrantOptions)**
    * gets the tournament attendees who competed in this phase
    * parameters
        * options
            * [EntrantOptions](#entrantoptions)
            * series of options for the return set of Entrants
    * returns Promise<[Entrant](#entrant)[]>
* **getSets(options: IGGSet.SetOptions)**
    * gets the tournament sets that occurred in this phase
    * parameters
        * options
            * [SetOptions](#setoptions)
            * series of options for the return set of GGSet
    * returns Promise<[GGSet](#ggset)[]>
* **getIncompleteSets(options: IGGSet.SetOptions)**
    * gets the tournament sets that occurred in this phase which are not completed
    * parameters
        * options
            * [SetOptions](#setoptions)
            * series of options for the return set of GGSet
    * returns Promise<[GGSet](#ggset)[]>
* **getCompleteSets(options: IGGSet.SetOptions)**
    * gets the tournament sets that occurred in this phase which are completed    
    * parameters
        * options
            * [SetOptions](#setoptions)
            * series of options for the return set of GGSet
    * returns Promise<[GGSet](#ggset)[]>
* **getSetsXMinutesBack(minutesBack: number, options: IGGSet.SetOptions)**
    * gets the tournament sets that occurred in this phase which were completed x minutes ago
    * parameters
        * options
            * [SetOptions](#setoptions)
            * series of options for the return set of GGSet
    * returns Promise<[GGSet](#ggset)[]>

----

## PhaseGroup
A Phase Group is the lowest unit on smash.gg. It is a bracket of some sort that belongs to a Phase.

```javascript
const smashgg = require('smashgg.js');
const PhaseGroup = smashgg.PhaseGroup;

let phaseGroup1 = await PhaseGroup.get(44445);
```

### Constructor
```js
PhaseGroup(
    id: number,
    phaseId: number,
    displayIdentifier: string | null,
    firstRoundTime: number | null,
    state: number | null,
    waveId: number | null,
    tiebreakOrder: object | null
)
```

### Properties
* **id** 
    * number
* **phaseId** 
    * number
* **displayIdentifier** 
    * string | null
* **firstRoundTime** 
    * number | null
* **state** 
    * number | null
* **waveId** 
    * number | null
* **tiebreakOrder** 
    * object | null


### Methods

* **getId()**
    * gets the numeric identifier of the phase group
    * returns number
* **getPhaseId()**
    * gets the numeric identifier of the phase groups owning phase
    * returns number
* **getDisplayIdentifier()**
    * gets the display identifier string of the phase group
    * returns string | null
* **getFirstRoundTime()**
    * get the time of the first round of the phase group as a unix epoch
    * returns number | null
* **getState()**
    * get the numeric state of the the phase group
    * returns number | null
* **getWaveId()**
    * get the numeric wave id of the phase group
    * returns number | null
* **getTiebreakOrder()**
    * get the JSON tiebreaker order of the phase group
    * returns object | null

* **getSeeds(options: ISeed.SeedOptions)**
    * gets the seeds in this phase group
    * parameters
        * options
            * [SeedOptions](#seedoptions)
            * series of options for the return set of Seeds
    * returns Promise<[Seed](#seed)[]>
* **getEntrants(options: IEntrant.EntrantOptions)**
    * gets the tournament attendees who competed in this phase group
    * parameters
        * options
            * [EntrantOptions](#entrantoptions)
            * series of options for the return set of Entrants
    * returns Promise<[Entrant](#entrant)[]>
* **getAttendees(options: IAttendee.AttendeeOptions)**
    * gets the tournament attendees who were in this phase group
    * parameters
        * options
            * [AttendeeOptions](#attendeeoptions)
            * series of options for the return set of Attendees
    * returns Promise<[Attendee](#attendee)[]>
* **getSets(options: IGGSet.SetOptions)**
    * gets the tournament sets that occurred in this phase group
    * parameters
        * options
            * [SetOptions](#setoptions)
            * series of options for the return set of GGSet
    * returns Promise<[GGSet](#ggset)[]>
* **getCompleteSets(options: IGGSet.SetOptions)**
    * get the tournament sets in this phase group that have been completed
    * parameters
        * options
            * [SetOptions](#setoptions)
            * series of options for the return set of GGSet
    * returns Promise<[GGSet](#ggset)[]>
* **getIncompleteSets(options: IGGSet.SetOptions)**
    * get the tournament sets in this phase group that have not been completed
    * parameters
        * options
            * [SetOptions](#setoptions)
            * series of options for the return set of GGSet
    * returns Promise<[GGSet](#ggset)[]>
* **getSetsXMinutesBack(minutes: number, options: IGGSet.SetOptions)**
    * get the tournament sets in this phase group that have been completed within the last x minutes
    * parameters
        * options
            * [SetOptions](#setoptions)
            * series of options for the return set of GGSet
    * returns Promise<[GGSet](#ggset)[]>

----

## User
A User is a data object that holds information about users on Smash.gg's platform 
This is equivalent to the `Player` object in smash.gg's context.

```javascript

var user = new User(000000, 'cookiE', 'Brandon Cooke', 'US', 'GA', 'Recursion')

console.log(user.getTag()); // prints 'cookiE'
console.log(user.getState()); // prints 'GA'
```

### Constructor
```js
User(
    id: number,
    gamerTag: string,
    prefix: string | null,
    color: string | null,
    twitchStream: string | null,
    twitterHandle: string | null,
    youtube: string | null,
    region: string | null,
    state: string | null,
    country: string | null,
    gamerTagChangedAt: number | null
)
```

### Properties
* **id** 
    * number
* **gamerTag** 
    * string
* **prefix** 
    * string | null
* **color** 
    * string | null
* **twitchStream** 
    * string | null
* **twitterHandle** 
    * string | null
* **youtube** 
    * string | null
* **region** 
    * string | null
* **state** 
    * string | null
* **country** 
    * string | null
* **gamerTagChangedAt** 
    * number | null

### Methods
* **getId()** 
    * gets the numeric id of the User
    * returns number
* **getGamerTag()** 
    * gets the gamer tag of the User
    * returns string
* **getSponsor()** 
    * get the sponsor prefix of the User
    * returns string | null
* **getColor()** 
    * get the color the User has chosen
    * returns string | null
* **getTwitchStream()** 
    * get the linked twitch channel name of the User
    * returns string | null
* **getTwitterHandle()** 
    * get the linked twitter handle of the User
    * returns string | null
* **getYoutube()** 
    * get the linked youtube channel of the User
    * returns string | null
* **getRegion()** 
    * get the region the User is from
    * returns string | null
* **getState()** 
    * get the state the User is from
    * returns string | null
* **getCountry()** 
    * get the country the User is from
    * returns string | null
* **getGamerTagChangedAt()** 
    * get the last time the User changed their gamer tag as a JS Date object
    * returns Date | null

* **getRecentSets()** 
    * get a list of the recent GGSets the User has competed in
    * return Promise<[GGSet](#ggset)[]>
* **getRankings()** 
    * get a list of the rankings the User has achieved.
    * return Promise<PlayerRank[]>

----

## Attendee
An Attendee is a person who attendeed a tournament.
This is equivalent to `Participant` in Smash.gg's context.

### Constructor
```js
Attendee(
    id: number,
    gamerTag: string,
    prefix: string | null,
    createdAt: number | null,
    claimed: boolean | null,
    verified: boolean | null,
    playerId: number | null,
    phoneNumber: number | null,
    connectedAccounts: object | null,
    contactInfo: IAttendee.ContactInfo | null,
    eventIds: number[] | null
)
```

### Properties
* **id** 
    * number
* **gamerTag** 
    * string
* **prefix** 
    * string | null
* **createdAt** 
    * number | null
* **claimed** 
    * boolean | null
* **verified** 
    * boolean | null
* **playerId** 
    * number | null
* **phoneNumber** 
    * number | null
* **connectedAccounts** 
    * object | null
* **contactInfo** 
    * IAttendee.ContactInfo | null
* **eventIds** 
    * number[] | null

### Methods
* **getId()**
    * get the numeric id for the Attendee in the tournament
    * returns number
* **getGamerTag()**
    * get the gamer tag of the Attendee
    * returns string
* **getSponsor()**
    * get the sponsor prefix of the Attendee
    * returns string | null
* **getCreatedAt()**
    * get the unix epoch of when this Attendee was created
    * returns number | null
* **getClaimed()**
    * get the true/false value of if this Attendee is claimed by a user 
    * returns boolean | null
* **getVerified()**
    * get the true/false value of if this Attendee is verified
    * returns boolean | null
* **getPlayerId()**
    * get the numeric identifier of the associated [User](#user) object
    * returns number | null
* **getPhoneNumber()**
    * get the phone number of the Attendee
    * returns number | null
* **getContactInfo()**
    * get the contact info of the Attendee
    * returns ContactInfo | null
* **getCity()**
    * get the city the Attendee is from
    * returns string | null
* **getState()**
    * get the state the Attendee is from
    * returns string | null
* **getStateId()**
    * get the numeric id of the state the Attendee is from
    * returns number | null
* **getCountry()**
    * get the country the Attendee is from
    * returns string | null
* **getCountryId()**
    * get the numeric id of the country the Attendee is from
    * returns number | null
* **getContactName()**
    * get the contact name of the Attendee
    * returns string | null
* **getFirstName()**
    * get the first name of the Attendee
    * returns string | null
* **getLastName()**
    * get the last name of the Attendee
    * returns string | null
* **getZipcode()**
    * get the zip code of the Attendee
    * returns string | null
* **getConnectedAccounts()**
    * get a list of connected accounts to this Attendee
    * returns object | null

### AttendeeOptions
```js
{
    page?: number | null,
    perPage?: number | null,
    sortBy?: string | null,
    filter?: null | {
        id?: number,
        entrantName?: string,
        checkInState?: number,
        phaseGroupId?: number[],
        phaseId?: number[],
        eventId?: number,
        seach?:{
            fieldsToSearch: string[],
            searchString: string
        }
    }
}
```

----

## Entrant
An `Entrant` is an `Attendee` who entered and competed in an `Event`.
This is the same as `Entrant` in Smash.gg's context

### Constructor
```js
Entrant(
    id: number,
    name: string, 
    eventId: number,
    skill: number,
    attendeeData: Attendee[]
)
```

### Properties
* **id** 
    * number,
* **name** 
    * string, 
* **eventId** 
    * number,
* **skill** 
    * number,
* **attendeeData** 
    * Attendee[]

### Methods
* **getId()**
    * get the numeric id of the Entrant
    * returns number
* **getName()**
    * get the name of the Entrant
    * returns string 
* **getEventId()**
    * get the numeric identifier of the Event the Entrant is in
    * returns number
* **getSkill()**
    * get the skill level of the Entrant
    * returns number

* **getAttendeeData(position: number)**
    * get a list of [Attendee](#attendee) data connected to the Entrant
    * parameters
        * position
            * number
            * the array index of the desired [Attendee](#attendee)
    * returns Attendee | Attendee[]
* **getAttendeeId(position: number)**
    * get the numeric id of the [Attendee](#attendee) connected to the Entrant
    * parameters
        * position
            * number
            * the array index of the desired [Attendee](#attendee)
    * returns number
* **getGamerTag(position: number)**
    * get the gamer tag of the [Attendee](#attendee) connected to the Entrant
    * parameters
        * position
            * number
            * the array index of the desired [Attendee](#attendee)
    * returns string
* **getSponsor(position: number)**
    * get the sponsor prefix of the [Attendee](#attendee) connected to the Entrant
    * parameters
        * position
            * number
            * the array index of the desired [Attendee](#attendee)
    * returns string | null
* **getPhoneNumber(position: number)**
    * get the phone number of the [Attendee](#attendee) connected to the Entrant
    * parameters
        * position
            * number
            * the array index of the desired [Attendee](#attendee)
    * returns number | null
* **getContactInfo(position: number)**
    * get the contact info of the [Attendee](#attendee) connected to the Entrant
    * parameters
        * position
            * number
            * the array index of the desired [Attendee](#attendee)
    * returns IAttendee.ContactInfo | null
* **getCity(position: number)**
    * get the city of the [Attendee](#attendee) connected to the Entrant
    * parameters
        * position
            * number
            * the array index of the desired [Attendee](#attendee)
    * returns string | null
* **getState(position: number)**
    * get the state of the [Attendee](#attendee) connected to the Entrant
    * parameters
        * position
            * number
            * the array index of the desired [Attendee](#attendee)
    * returns string | null
* **getStateId(position: number)**
    * get the numeric id of the state of the [Attendee](#attendee) connected to the Entrant
    * parameters
        * position
            * number
            * the array index of the desired [Attendee](#attendee)
    * returns number | null
* **getCountry(position: number)**
    * get the country of the [Attendee](#attendee) connected to the Entrant
    * parameters
        * position
            * number
            * the array index of the desired [Attendee](#attendee)
    * returns string | null
* **getCountryId(position: number)**
    * get the numeric id of the country of the [Attendee](#attendee) connected to the Entrant
    * parameters
        * position
            * number
            * the array index of the desired [Attendee](#attendee)
    * returns number | null
* **getName(position: number)**
    * get the name of the of the [Attendee](#attendee) connected to the Entrant
    * parameters
        * position
            * number
            * the array index of the desired [Attendee](#attendee)
    * returns string | null
* **getFirstName(position: number)**
    * get the first name of the [Attendee](#attendee) connected to the Entrant
    * parameters
        * position
            * number
            * the array index of the desired [Attendee](#attendee)
    * returns string | null
* **getLastName(position: number)**
    * get the last name of the [Attendee](#attendee) connected to the Entrant
    * parameters
        * position
            * number
            * the array index of the desired [Attendee](#attendee)
    * returns string | null
* **getZipcode(position: number)**
    * get the zip code of the [Attendee](#attendee) connected to the Entrant
    * parameters
        * position
            * number
            * the array index of the desired [Attendee](#attendee)
    * returns string | null		
* **getConnectedAccounts()**
    * returns object | null

### EntrantOptions
```js
{
    page?: number | null,
    perPage?: number | null,
    sortBy?: string | null,
    filter?: null | {
        id?: number,
        entrantName?: string,
        checkInState?: number,
        phaseGroupId?: number[],
        phaseId?: number[],
        eventId?: number,
        seach?:{
            fieldsToSearch: string[],
            searchString: string
        }
    }
}
```

----

## GGSet
A Set is a data object that holds information about a tournament set
that took place at a tournament.

### Constructor
```js
GGSet(
    id: number,
    eventId: number | null,
    phaseGroupId: number | null,
    displayScore: string | null,
    fullRoundText: string | null,
    round: number | null,
    startedAt: number | null,
    completedAt: number | null,
    winnerId: number | null,
    totalGames: number | null,
    state: number | null,
    player1: PlayerLite,
    player2: PlayerLite,
    score1: number | null,
    score2: number | null
)
```

### Properties 
* **id**
    * number 
* **eventId**
    * number | null
* **phaseGroupId**
    * number | null
* **displayScore**
    * string | null 
* **fullRoundText**
    * string | null
* **round**
    * number | null
* **startedAt**
    * number | null
* **completedAt**
    * number | null
* **winnerId**
    * number | null
* **totalGames**
    * number | null
* **state**
    * number | null
* **player1**
    * [PlayerLite](#playerlite)
* **player2**
    * [PlayerLite](#playerlite)
* **score1**
    * number | null
* **score2**
    * number | null


### Methods
* **getEventId()**
    * get the numeric identifier of the GGSet
    * returns number | null
* **getPhaseGroupId()**
    * get the numeric identifier of the Phase the GGSet belongs to
    * returns number | null
* **getStartedAt()**
    * get the time the GGSet started as a JS Date object
    * returns Date | null 
* **getCompletedAt()**
    * get the time the GGSet ended as a JS Date object
    * returns Date | null 
* **getDisplayScore()**
    * get the display score string of the GGSet
    * format "Tag1 Score1 - Score2 Tag2"
    * returns string | null
* **getFullRoundText()**
    * get the full round text of the tournament this GGSet takes place 
    * returns string | null
* **getRound()**
    * get the numeric round of the tournament this GGSet takes place
    * returns number | null
* **getState()**
    * get the numeric state of the GGSet
    * returns number | null
* **getPlayer1()**
    * get the first player in the GGSet
    * returns [PlayerLite](#playerlite) | undefined | null
* **getPlayer1Tag()**
    * get the first player's tag in the GGSet
    * returns string | undefined | null
* **getPlayer1PlayerId()**
    * get the first player's User ID in the GGSet
    * returns number | undefined | null
* **getPlayer1AttendeeIds()**
    * get the first player's Attendee ID in the GGSet
    * returns number[] | undefined | null
* **getPlayer2()**
    * get the second player in the GGSet
    * returns [PlayerLite](#playerlite) | undefined | null
* **getPlayer2Tag()**
    * get the second player's tag in the GGSet
    * returns string | undefined | null
* **getPlayer2PlayerId()**
    * get the second player's User ID in the GGSet
    * returns number | undefined | null
* **getPlayer2AttendeeIds()**
    * get the second player's Attendee ID In the GGSet
    * returns number[] | undefined | null
* **getWinnerId()**
    * get the Entrant ID of the winning player
    * returns number | null
* **getLoserId()**
    * get the Entrant ID of the losing player
    * returns number | null
* **getIsComplete()**
    * get the true/false value for if this GGSet has been completed
    * returns boolean | null
* **getPlayer1Score()**
    * get the score of the first player in the GGSet
    * returns number | null
* **getPlayer2Score()**
    * get the score of the second player in the GGSet
    * returns number | null
* **getWinner()**
    * get the winner of the GGSet
    * returns PlayerLite | undefined
* **getLoser()**
    * get the loser of the GGSet
    * returns PlayerLite | undefined
* **getBestOfCount()**
    * get the Best-Of count of the GGSet
    * returns number | string
* **getWinnerScore()**
    * get the score of the winner in the GGSet
    * returns number | string
* **getLoserScore()**
    * get the score of the loser in the GGSet
    * returns number | string

### SetOptions
```js
{
    filterDQs?: boolean,
    filterByes?: boolean,
    filterResets?: boolean,
    page?: number | null,
    perPage?: number | null,
    sortBy?: null | 'NONE' | 'STANDARD' | 'RACE_SPECTATOR' | 'ADMIN',
    filters?: null | {
        entrantIds?: number[],
        state?: number[],
        stationIds?: number[],
        phaseIds?: number[],
        phaseGroupIds?: number[],
        roundNumber?: number
    }
}
```

### PlayerLite
```js
{
    tag: string | null,
    entrantId: number | null,
    attendeeIds: number[]
}
```

----

## Stream
A Stream is a live stream of a Tournament

### Constructor
```js
Stream(
    id: number,
    eventId: number | null,
    tournamentId: number | null,
    streamName: string,
    numSetups: number | null,
    streamSource: 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null,
    streamType: number | null,
    streamTypeId: number | null,
    isOnline: boolean | null,
    enabled: boolean | null,
    followerCount: number | null,
    removesTasks: boolean | null,
    streamStatus: string | null,
    streamGame: string | null,
    streamLogo: string | null
)
```

### Properties
* **id** 
    * number
* **eventId** 
    * number | null
* **tournamentId** 
    * number | null
* **streamName** 
    * string
* **numSetups** 
    * number | null
* **streamSource** 
    * 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null
* **streamType** 
    * number | null
* **streamTypeId** 
    * number | null
* **isOnline** 
    * boolean | null
* **enabled** 
    * boolean | null
* **followerCount** 
    * number | null
* **removesTasks** 
    * boolean | null
* **streamStatus** 
    * string | null
* **streamGame** 
    * string | null
* **streamLogo** 
    * string | null

### Methods
* **getId()** 
    * get the numeric ID of the Stream
    * number,
* **getEventId()** 
    * get the ID of the Event this Stream occurred in
    * number | null,
* **getTournamentId()** 
    * get the ID of the Tournament this Stream occurred in
    * number | null,
* **getStreamName()** 
    * get the name of the Stream
    * string,
* **getNumSetups()** 
    * get the number of setups
    * number | null,
* **getStreamSource()** 
    * get the source of the Stream
    * 'TWITCH' | 'HITBOX' | 'STREAMME' | 'MIXER' | null,
* **getStreamType()** 
    * get the type of the Stream
    * number | null,
* **getStreamTypeId()** 
    * get the numeric type of the Stream
    * number | null,
* **getIsOnline()** 
    * get the true/false value for if the Stream is online
    * boolean | null,
* **getEnabled()** 
    * get the true/false value of if the Stream is enabled
    * boolean | null,
* **getFollowerCount()** 
    * get the follower count the Stream has
    * number | null,
* **getRemovesTasks()** 
    * get the true/false value of if this Stream removes tasks
    * boolean | null,
* **getStreamStatus()** 
    * get the status of the Stream
    * string | null,
* **getStreamGame()** 
    * get the game the Stream is streaming
    * string | null,
* **getStreamLogo()** 
    * get the url of the Stream's logo
    * string | null

----

## StreamQueue
A StreamQueue is a Queue of [GGSets](#ggset) that are in line to be played on a [Stream](#stream)

### Constructor
```js
StreamQueue(
    stream: Stream,
    sets: GGSet[]
)
```

### Properties
* **stream** 
    * [Stream](#stream)
* **sets** 
    * [GGSet](#ggset)[]

### Methods
* **getStream()**
    * get the associated [Stream](#stream) object
    * return [Stream](#stream)
* **getSets()**
    * get a list of GGSets queued to be played on the [Stream](#stream)
    * return [GGSet](#ggset)[]

----

## Seed

### Constructor
```js
Seed(
    id: number,
	entrantId: number,
	placeholderName: string,
	seedNumber: number,
	placement: number,
	isBye: boolean
)
```

### Properties
* **id** 
    * number
* **entrantId** 
    * number
* **placeholderName** 
    * string
* **seedNumber** 
    * number
* **placement** 
    * number
* **isBye** 
    * boolean

### SeedOptions
```js
{
    page?: number | null,
    perPage?: number | null,
    sortBy?: string | null,
    filter?: null | {
        id?: number
        entrantName?: string
        checkInState?: number
        phaseGroupId?: number[]
        phaseId?: number[]
        eventId?: number
        search?: {
            fieldsToSearch: string[]
            searchString: string
        }
    }
}
```


----

## Character
A Character object encapsulates data about a fighting game character in the smashgg system
```javascript
let meleeCharacters = await Character.getByGameName('melee')
let pmCharacters = await Character.getByGameId(2)

let allBowsers = await Character.getByName('bowser')
allBowsers.forEach(bowser => {
    console.log(bowser)
})

let allCharacters = await Character.getAll({isCached: false})
allCharacters.forEach(character => {
    console.log(character)
})

let meleeBowser = await Character.getByNameAndGame('bowser', 'melee')
let wolfPM = await Character.getByNameAndGameId('wolf', 2)
```

### Constructor
* **Character(id, name, isCommon, videogameId)**
    * **id** - ID number of the character in the smashgg system
    * **name** - Name of the character
    * **isCommon** - T/F value for if the character is a common one
    * **videogameId** - ID of the SmashGG VideoGame this character belongs to

### Methods
#### Promises
* **static async getAll([options])**
    * Returns a Promise resolving an array of `Character` objects representing all characters in SmashGG
    * **options** - object containing options for the function
        * **isCached** - boolean value for if the results should be fetched/put into cache. Default is true
* **static async getById(id [, options])**
    * Returns a Promise resolving a `Character` object representing the character in SmashGG with the given id
    * **id** - [*required*] ID number of the character in SmashGG's system
    * **options** - object containing options for the function
        * **isCached** - boolean value for if the results should be fetched/put into cache. Default is true
* **static async getByName(name [, options])**
    * Returns a Promise resolving an Array of `Character` objects representing the character in SmashGG that match the given name
    * **name** - [*required*] Name of the desired character in SmashGG's system
    * **options** - object containing options for the function
        * **isCached** - boolean value for if the results should be fetched/put into cache. Default is true
* **static async getByGameId(id [, options])**
    * Returns a Promise resolving an Array of `Character` objects representing all the characters from the given Smashgg videogame Id
    * **id** - [*required*] Id of the SmashGG VideoGame which to fetch all characters from
    * **options** - object containing options for the function
        * **isCached** - boolean value for if the results should be fetched/put into cache. Default is true
* **static async getByGameName(name [, options])**
    * Returns a Promise resolving an Array of `Character` objects representing all the characters from the given Smashgg videogame name/slug/displayname
    * **name** - [*required*] Display Name/short name/nickname of the game in SmashGG's system
    * **options** - object containing options for the function
        * **isCached** - boolean value for if the results should be fetched/put into cache. Default is true
* **static async getByNameAndGameId(name, videogameId [, options])**
    * Returns a Promise resolving a `Character` object from the SmashGG Character name and the VideoGame ID
    * **name** - [*required*] Name of the character in SmashGG's system
    * **videogameId** - [*required*] ID number of the videogame in SmashGG's system
    * **options** - object containing options for the function
        * **isCached** - boolean value for if the results should be fetched/put into cache. Default is true
* **static async getByNameAndGame(name, gameName [, options])**
    * Returns a Promise resolving a `Character` object from the SmashGG Character name and the Videogame name
    * **name** - [*required*] Name of the character in SmashGG"s system
    * **gameName** - [*required*] Display name/name/slug of the SmashGG video game
    * **options** - object containing options for the function
        * **isCached** - boolean value for if the results should be fetched/put into cache. Default is true

#### Getters
* **getId()** - returns the SmashGG Character ID 
* **getName()** - returns the Name of the character
* **getIsCommon()** - returns the T/F isCommon value of the character
* **getVideoGameId()** - return the SmashGG VideoGame ID that the character belongs to

----

## VideoGame
A VideoGame object encapsulates data about VideoGames respective to how they are known in Smash GG's system
```javascript
let melee = await VideoGame.getByName('melee')
/* produces: 
{   id:1,
    name:'Super Smash Bros. Melee',
    abbrev:'Melee',
    displayName:'Melee',
    minPerEntry:1,
    maxPerEntry:2,
    approved:true,
    slug:'melee',
    isCardGame:null
}
*/

let pm = await VideoGame.getById(2)
/* produces:
{
    id:2,
    name:'Project M',
    abbrev:'pm',
    displayName:'PM',
    minPerEntry:null,
    maxPerEntry:null,
    approved:true,
    slug:'pm',
    isCardGame:null
}
*/

let allGames = await VideoGame.getAll()
/* produces array of all VideoGame objects in SmashGG */
```

### Constructor
* **VideoGame(id, name, abbrev, displayName, minPerEntry, maxPerEntry, approved, slug, isCardGame)**
    * **id** - id number of the game
    * **name** - full name of the game
    * **abbrev** - abbreviated name of the game
    * **displayName** - display name of the game on smashgg's site
    * **minPerEntry** - minimum number of entrants that can sign up
    * **maxPerEntry** - maximum number of entrants that can sign up
        * eg: Melee is 2 because of doubles, two individuals can sign up at once
    * **approved** - boolean if the game has been approved in smashgg's system
    * **slug** - the game's url slug
    * **isCardGame** - boolean for if the game is a card game

### Methods
#### Statics
* **static async getAll([options])**
    * Returns an array of VideoGame objects representing every game in smashgg's system
    * **options** - optional options object
        * **isCached** - boolean for if the value should be cached/pulled from cache

* **static async getByName(name [,options])**
    * Returns a VideoGame object representing the video game belonging to the given name
        * This value will match the games `name`, `abbrev`, `displayName`, and `slug` properties
    * **name** - [*required*] - name, abbrev, displayName, or slug of the desired game
    * **options** - optional options object
        * **isCached** - boolean for if the value should be cached/pulled from cache

* **static async getById(id [,options])**
    * Returns a VideoGame object representing the video game belonging to the given id
    * **id** - [*required*] - id of the desired game
    * **options** - optional options object
        * **isCached** - boolean for if the value should be cached/pulled from cache

#### Getters
* **getId()**
    * return the id of the Video Game
* **getName()**
    * return the full name of the Video Game
* **getAbbreviation()**
    * return the abbreviation of the Video Game
* **getDisplayName()**
    * return the smashgg display name of the Video Game
* **getMinPerEntry()**
    * return the minimum number of participants for an entry of the Video Game
* **getMaxPerEntry()**
    * return the maximum number of participants for an entry of the Video Game
* **getApproved()**
    * return the boolean value of if the Video Game has been approved for smashgg
* **getSlug()**
    * return the url slug of the Video Game
* **getIsCardGame()**
    * return the boolean value of if the Video Game is a card game

## Upgrading
This section is for detailing the transition between major versions. 

### V2 to V3
In order to transition successfully from V2 to V3, please ensure the following 
All `Set` objects created by smashgg.js are renamed to GGSet

### V1 to V2
In order to transition successfully from V1 to V2, please ensure the following 
* Event constructors now take eventId parameter before tournamentId parameter.
    * Additionally, you can give the constructor an Id number for the event, and null tournamentId.
* `Tournament`, `Event`, `Phase`, and `PhaseGroup` constructors now take an `options` object that encapsulates the previous `isCached` and `expands` parameters. 
    * Please see documentation for further implementation.
* It is suggested you move to the Promise returning convenience methods, as the previous `ready` event will be deprecated from this point on.
    * Please see documentation for the convenience methods. They take the same parameters as the constructor.
