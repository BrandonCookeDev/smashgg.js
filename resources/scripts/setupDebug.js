'use strict';

const fs = require('fs');
const path = require('path');

const DOTENV_FILEPATH = path.join(__dirname, '..', '..', '.env');
const DOTENV_CONTENT = `
API_TOKEN=<put your api token here>
`;

console.log('Checking if .env file exists (%s)', DOTENV_FILEPATH);
if(!fs.existsSync(DOTENV_FILEPATH)){
    console.log('no .env file');
    fs.writeFileSync(DOTENV_FILEPATH, DOTENV_CONTENT);
    console.log('created .env file at (%s)', DOTENV_FILEPATH);
}
else console.log('.env already exists!');

