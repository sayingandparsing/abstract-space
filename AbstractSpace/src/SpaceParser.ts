import {
	Command,
	KeyCommand,
	MsgCommand,
	CmdType
} from './cmd_types/command'
import {log} from './util/logger'
import {
	NodeData
} from './types/DataTypes'

interface CT {

}

interface Metadata {
	symbol :string
	lab :string
	itemList? :ListedItem[]
	nested :boolean
}

type Leaf = number

interface Tree {
	data :NodeData
	[key :string]: Tree | Leaf | NodeData | Tree[]
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
		symbol :string
	) :Promise<Tree> {
		let result :Partial<Tree>= {}
		const data :Partial<NodeData> = {}
		if (tree instanceof Command) {
			data['lab'] = tree.name
			data['symbol'] = symbol
			data['nested'] = false
			result['data'] = <NodeData>data
			result['command'] = this.registerCommand(tree)
		}
		else if (tree instanceof Object) {
			const subtrees :Tree[]= []
			for (let key of Object.keys(tree)) {
				if (this.metadataFields.has(key)) {
					data[key] = tree[key];
				}
				else {
					subtrees.push(await this.traverse(tree[key], key))
				}
			}
			data['symbol'] = symbol
			data['nested'] = true
			result['data'] = <NodeData>data
			result['subtree'] = subtrees
		}
		else if (tree instanceof Command) {
			data['lab'] = tree.name
			data['symbol'] = symbol
			data['nested'] = true
			result['data'] = <NodeData>data
			result['command'] = this.registerCommand(tree)
		}

		return <Tree> result
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
