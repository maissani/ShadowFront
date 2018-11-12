import { ADD_ARTICLE, REMOVE_ARTICLE } from './'

export function addArticle(id) {
	return {
		type: ADD_TODO,
		id
	}
}

export function removeArticle(article) {
	return {
		type: REMOVE_ARTICLE,
		article
	}
}
