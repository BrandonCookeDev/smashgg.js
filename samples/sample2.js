'use strict';

let Event = require('../lib/Event');

(async function(){
    try{
        let event1 = await Event.getEventById('ceo-2018', 'melee-singles');

        process.exit(0);
    } catch(e){
        console.error(e);
        process.exit(1);
    }
})();