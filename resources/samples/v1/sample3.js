/* eslint-disable */
'use strict';

let smashgg = require('../../../src/v1')
let log = smashgg.Log;

(async function(){
    try{
        smashgg.setLogLevel('debug');
        log.debug('hello debug');
        log.verbose('hello verbose');

        smashgg.setLogLevel('info');
        log.debug('don\'t print me >:(');
        log.info('print me :)');
        log.verbose('but not me (:');

        smashgg.setLogLevel('warn');
        log.info('noinfo');
        log.warn('random no');
        log.debug('nope');

        process.exit(0)
    } catch(e){
        console.error(e)
        process.exit(1);
    }
})()