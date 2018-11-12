import { ADD_ARTICLE, REMOVE_ARTICLE } from '../actions'

export default function(state = [], action) {
	const { type, id, article } = action

	switch (type) {
		case ADD_ARTICLE:
			return [
				...state,
				{
					id
				}
			]
		case REMOVE_ARTICLE:
			return state.filter(i => i !== article)
		default:
			return state
	}
}
