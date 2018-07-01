/**
 * Created by rmacc on 5/2/2017.
 */

import {ViewController} from "./ViewController"
import EventEmitter = require('events')
import {
	DescentContext,
	NodeData,
	PathNode,
	TermNode,
	Connections,
	NodeSymbol, AnyNode, RootNode, ProcessState
} from "./DataTypes"
import {AbstractView} from "./AbstractView";


export class TreeTraversal {
    //context :DescentContext;
    eventQueue :NodeSymbol[]
    context :DescentContext
    viewEmitter = new EventEmitter()
	updateViewState: Function
	callback: Function
	deactivate

    //type NodeSymbol = String

    constructor(view :AbstractView, deactivate) {
		this.updateViewState = view.stateUpdateCallback()
		this.deactivate = deactivate
    }

    resetContext(root :RootNode)
    {
		console.log(root)
        this.context = {
            root: root,
            current: root,
            level: root.subtree.map(item => item.data),
            path: []
        }
        console.log('context')
        this.updateViewState(this.context.level)
    }

    processKeyEvent(key :NodeSymbol)
    {

		if (key === 'Escape') {
			console.log("Terminated")
			this.callback({
				type: 'failed',
				path: this.context.path
			})
			this.deactivate()
			return
		}
		let symbols = this.context.level.map(node => node.symbol)
        if (symbols.indexOf(key) > -1) {
    		console.log("update!!!")
            this.context.path.push(key)
			let current = <PathNode> this.context.current
			console.log("current")
            this.context.current = current.subtree[current.subtree.map(
            	node => node.data.symbol).indexOf(key)]

            if (this.isTerminal(
                    <PathNode|TermNode> this.context.current)) {
    			console.log("is terminal")
                let term = <TermNode> this.context.current
                this.callback({
                    type: 'command',
                    path: this.context.path,
                    content: term.command
                })
				this.deactivate()
				return

    		} else {

				let level = this.extractLevel(
					<PathNode> this.context.current)
				if (level) {
					this.context.level = level
					console.log('updating view state')
					this.updateViewState(level)
				} else {
					this.callback({
						type: 'failure',
						path: this.context.path
					})
					this.deactivate()
					return
				}
			}


		}
    }


    sendShutdownSignal()
    {

    }


    connectedTo(n :PathNode, sym :NodeSymbol) :boolean
    {
        for (let conn of n.subtree) {
            if (conn.data.symbol===sym)
                return true
        }
        return false
    }


    extractLevel(node :PathNode) :Connections
    {
        return node.subtree.map(desc => desc.data);
    }


    isTerminal(node :PathNode|TermNode) :boolean
    {
    	console.log("is terminal?")
        return (<TermNode>node).command !== undefined
    }


/*    sendKeyEvent() :NodeSymbol {

    }*/

}
