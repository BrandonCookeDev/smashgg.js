import * as Schema from './schema'
export const stream = `query StreamQuery($id: Int!){
	stream(id: $id){
		${Schema.stream}
	}
}`