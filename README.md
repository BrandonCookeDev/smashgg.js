# smashgg.js
## Author: Brandon Cooke

smashgg.js is a Node.js wrapper for the public Smash.gg API, which is rich
with data about tournament brackets that have occurred on their platform.

# Requirements
* Node.js 7+
* ecmascript 6

```javascript
var smashgg = require('smashgg.js');
var tournament = new Tournament('ceo-2016');

tournament.on('ready', async function(){
    var players = await tournament.getAllPlayers();
    var sets = await tournament.getAllSets();

    console.log(players.length + ' players entered ' + tournament.getName() +  ' overall');
    players.forEach(player => {
        console.log(
            'Tag: ' + player.getTag() + '\n',
            'Name: ' + player.getName() + '\n',
            'State: ' + player.getState() + '\n'
        )
    });

    console.log(sets.length + ' sets were played at ' + tournament.getName());
    sets.forEach(set => {
            console.log(
                '[%s: %s %s - %s %s]',
            set.getRound(),
            set.getWinner().getTag(), //Player object
            set.getWinnerScore(),
            set.getLoserScore(),
            set.getLoser().getTag()
        );
        console.log(
            '%s placed %s at the tournament \n%s placed %s at the tournament\n',
            set.getWinner().getTag(),
            set.getWinnersTournamentPlacement(),
            set.getLoser().getTag(),
            set.getLosersTournamentPlacement()
        )
    })

    console.log('Done!');
    return process.exit(0);
});
```

##### Output
```
2592 players entered CEO 2016 overall
Tag: Gwabs
 Name: Ian Chiong
 State: FL

Tag: Benteezy
 Name: Benny Frias
 State: NY

Tag: Jinzo
 Name: Gene Zhou
 State: FL

.... continues ....

8150 sets were played at CEO 2016
[Losers Semi-Final: Haus 2 - 1 Benteezy]
Haus placed 33 at the tournament
Benteezy placed 97 at the tournament

[Winners Round 2: Benteezy 2 - 0 Sabelan]
Benteezy placed 97 at the tournament
Sabelan placed 257 at the tournament

[Losers Quarter-Final: Benteezy 2 - 0 NIX]
Benteezy placed 97 at the tournament
NIX placed 129 at the tournament

.... continues ....

```

## Tournament
```
var tournament = new smashgg.Tournament('tipped-off-12');
tournament.on('ready', function(){
    //tournament is populated with data
    console.log('Got tournament ' + tournament.getName();
    var sets = tournament.getSets();
});
```

#### Constructor
* **Tournament(tournamentName [,expands, isCached]);**

    * **tournamentName** [required] - name slug or short tournament name
        * a slug is a string that uniquely identifies a tournament on the platform
            * tipped-off-12 or ceo-2016
        * a shortened name is a set abbreviation for a slug
            * to12 or ceo2016
    * **expands** - an object that defines which additional data is sent back. By default all values are marked true.
        * event - condensed data for the events that comprise this tournament
        * phase - condensed data for the phases that comprise the events
        * groups - condensed data for the groups that comprise the phases
        * stations - condensed data for the stations for each group
    * **isCached** - boolean parameter for if the api should cache the resulting object

#### Events
* **'ready'**
    * indicates when a Tournament object is populated with data

#### Methods
##### Promises
* **getAllPlayers([fromCacheTF])**
    * Returns a Promise that resolves an array of all `Player` objects that partook in the Tournament
    * **fromCacheTF** - boolean value for if the value should be retrieved from cache. Defaults to true

* **getAllSets([fromCacheTF])**
    * Returns a Promise that resolves an array of all `Set` objects that took place in the Tournament
    * **fromCacheTF** - boolean value for if the value should be retrieved from cache. Defaults to true


* **getAllEvents([fromCacheTF])**
    * Returns a Promise that resolves an array of all `Events` objects that are part of the Tournament.
    * **fromCacheTF** - boolean value for if the value should be retrieved from cache. Defaults to true

##### Getters
* **getId()**
    * returns the id of the tournament
* **getName()**
    * returns the name of the tournament
* **getSlug()**
    * returns the slug for the tournament
* **getTimezone()**
    * returns the string timezone the tournament occurred in
* **getStartTime()**
    * returns a string 'MM-DD-YYYY HH:mm:ss tz' for the start time of the tournament
* **getEndTime()**
    * returns a string 'MM-DD-YYYY HH:mm:ss tz' for the end time of the tournament
* **getWhenRegistrationCloses()**
    * returns a string 'MM-DD-YYYY HH:mm:ss tz' for the time registration is set to close
* **getCity()**
    * returns the city where the tournament occurred
* **getState()**
    * returns the state where the tournament occurred
* **getZipCode()**
    * returns the zip code where the tournament occurred
* **getContactEmail()**
    * return the email address listed for contacting
* **getContactTwitter()**
    * return the twitter handle listed for contacting
* **getOwnerId()**
    * return the id of the tournament owner
* **getVenueFee()**
    * return the cost of the venue fee for the tournament
* **getProcessingFee()**
    * return the cost of the processing fee to register for the tournament
