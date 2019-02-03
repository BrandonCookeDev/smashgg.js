import * as Schema from './schema'

export const set = `query SetQuery($id: String!){
set(id:$id){
	${Schema.set}
}`

export const games = `query SetQuery($id: String!){
set(id:$id){
	games{
		${Schema.game}
	}
}`