'use strict'

const LEGAL_ENCODINGS = ['json', 'utf8', 'base64']
const DEFAULT_ENCODING = process.env.DefaultEncoding ?? 'json'

export default class Encoder{

	public static determineEncoding(encoding: string | undefined): string {
		return encoding !== undefined && LEGAL_ENCODINGS.includes(encoding) ? encoding : DEFAULT_ENCODING
	}

	public static encode(data: object, encoding: string=DEFAULT_ENCODING): object | string {
		const encoded = encoding === 'json' ? data : Buffer.from(JSON.stringify(data)).toString(encoding)
		return encoded
	}

	public static decode(data: object | string, encoding: string=DEFAULT_ENCODING): object {
		const decoded = encoding === 'json' ? data : JSON.parse(Buffer.from(data.toString(), encoding).toString('utf8'))
		return decoded
	}
}
