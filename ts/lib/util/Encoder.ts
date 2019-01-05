'use strict';

const LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
const DEFAULT_ENCODING = 'json';

class Encoder{

	static determineEncoding(encoding: string) : string {
		return encoding != undefined && LEGAL_ENCODINGS.includes(encoding) ? encoding : DEFAULT_ENCODING;
	}

	static loadData(data: object, encoding: string=DEFAULT_ENCODING) : object | string {
		let encoded = encoding == 'json' ? data : new Buffer(JSON.stringify(data)).toString(encoding);
		return encoded;
	}

	static getData(data: object, encoding: string=DEFAULT_ENCODING) : object | string {
		let decoded = encoding == 'json' ? data : JSON.parse(new Buffer(data.toString(), encoding).toString('utf8'));
		return decoded;
	}
}

module.exports = Encoder;