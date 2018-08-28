

import * as process from 'process'
import * as path from 'path'

const treeDir = process.env.AS_TREES

export const loadTrees = () => {
	/*return ['desktop', 'browser']
			.map(tree => require(path.join(treeDir, tree)))*/
	return [
		'desktop',
		'browser'
	].map(tree => require('./'+tree))
}
