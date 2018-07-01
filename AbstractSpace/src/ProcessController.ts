'use strict';

import {TreeTraversal} from './TreeTraversal'
import {AbstractView} from "./AbstractView";
import * as React from "react"
import {render} from "react-dom"
import {RabbitServer} from './ipc'
import {remote} from 'electron'
import {SingleViewService} from './SingleViewService'



class ProcessController {


	active: boolean;
	//let keyEventEmitter = new EventEmitter();
	//let keypressListener = new keypress.Listener()
	//let view = new ViewController(window);
	//let view = React.createElement("AbstractView")
	main = document.getElementById("main")
	a = document.createElement("p")

	view = render(
		React.createElement(AbstractView, null),
		this.main
	)
	traversal = new TreeTraversal(this.view, this.deactivateSelection);
	viewService = new SingleViewService(this.view)

	commandTrees
	ipc

	constructor() {
		this.commandTrees = {}
		this.ipc = new RabbitServer(this.path)
			.on('tree', (content, replyCb) => {
				console.log('received tree')
				let name = content['data']['symbol']
				this.commandTrees[name] = content
				//console.log(this.commandTrees)
				//console.log('added ' + name)
			})
			.on(['display', 'tree'], (content, replyCb) => {
				let requestedTree = this.commandTrees['standard']
				console.log('received display request')
				if (requestedTree !== null) {
					//console.log(requestedTree)
					this.run_traversal(requestedTree, replyCb)
				} else {
					console.log('couldn+\'t find a tree called ' + content)
					replyCb({type: 'failed'})
				}
			})
			.on('chain view', (content, replyCb) => {
				this.viewService.display(content, replyCb)
			})
			.on('end chain', (content, replyCb) => {
				this.viewService.breakChain()
			})
			/*.on(['display', 'appTree'] , (content, replyCb) => {
				console.log('received app tree')
				let requestedTree = this.commandTrees['app_specific'][content.name]
				console.log('requested tree = '+content.name)
				if (requestedTree !== null)
					this.run_traversal(requestedTree, replyCb)
				else {
					console.log('couldn+\'t find a tree called ' + content)
					replyCb({type: 'failed'})
				}
			})*/
			.createServer()
	}



	path = 'display'


	processDisplayRequest(msg) {
		if (!msg.hasOwnProperty('subtype')) {
			console.log('Expected a subtype for display request')
			return
		}
		switch (msg.subtype) {
			case 'view':
				break
			case 'tree':
				let requestedTree = this.commandTrees[msg.content]
				if (requestedTree !== null) {
					//run_traversal(requestedTree)
				} else {
					console.log('couldn+\'t find a tree called ' + msg.content)
				}
		}
	}


	run_traversal(tree, replyFn) {
		console.log('running traversal')
		window.addEventListener('keydown', (ev) => {
			//console.log(ev)
			if (this.active) {
				try {
					this.traversal.processKeyEvent(ev.key)
				} catch (e) {
				}
			}
		})
		this.activateSelection(tree, replyFn)
	}


	activateSelection(tree, replyCb) {
		this.traversal.callback = replyCb
		this.traversal.resetContext(tree)
		this.active = true
		remote.getCurrentWindow().show()
	}

	deactivateSelection() {
		this.active = false
		remote.getCurrentWindow().hide()

		//// REPLACE

		//window.removeEventListener('keydown')
	}

	publishTraversalState(state) {

	}
}
console.log('executing')
let p = new ProcessController()
