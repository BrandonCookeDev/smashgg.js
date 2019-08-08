import * as Schema from './schema'
export const stream = `query StreamQuery($id: ID!){
	stream(id:$id){
		${Schema.stream}
	}
}`
