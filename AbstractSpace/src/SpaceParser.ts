import {
	Command,
	KeyCommand,
	MsgCommand,
	CmdType
} from './cmd_types/command'
import {log} from './util/logger'

interface CT {

}

interface Metadata {
	symbol :string
	lab :string
	itemList :ListedItem[]
}

type Leaf = number

interface Tree {
	data :Metadata
	[key :string]: Tree | Leaf | Metadata
}

interface ListedItem {
	symbol :string
	label :string
	fn ?:string
}



export class SpaceParser {

	newCmdId = 0
	commands :{[key:number]:Command} = {}

    constructor(structureDir :string) {

	}

	metadataFields = new Set([
		'lab',
		'fn',
		//'symbol'
	])


	async traverse (
		tree,
		symbol :String
	) /*:Tree|Command*/ {
		log.debug('starting traversal')
		let result = {}
		const data = {}
		log.debug(typeof tree)
		if (tree instanceof Command) {
			log.debug('Registering command: ')
			log.debug(<Command> tree.name)
			data['lab'] = tree.name
			data['symbol'] = symbol
			result['data'] = data
			result['command'] = this.registerCommand(tree)
		}
		else if (tree instanceof Object) {
			log.debug('branches')
			const subtrees = []
			for (let key of Object.keys(tree)) {
				if (this.metadataFields.has(key)) {
					data[key] = tree[key];
				}
				else {
					subtrees.push(await this.traverse(tree[key], key))
				}
			}
			data['symbol'] = symbol
			result['data'] = data
			result['subtree'] = subtrees
		}
		else if (tree instanceof Command) {
			log.debug('Registering command: ')
			log.debug(<Command> tree.name)
			data['lab'] = tree.name
			data['symbol'] = symbol
			result['data'] = data
			result['command'] = this.registerCommand(tree)
		}

		return result
	}

	getId = () :number => {
		const id = this.newCmdId
		this.newCmdId++
		return id
	}

	registerCommand <T extends Command> (
		command :T
	) : number {
		const id = this.getId()
		this.commands[id] = command
		return id
	}

}
