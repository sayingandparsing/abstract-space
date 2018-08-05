'use strict';

import {TreeTraversal}     from './TreeTraversal'
import {RabbitServer, ProcessInterface}      from './ipc'
import {SingleViewService} from './SingleViewService'
import {log}               from './util/logger'
import {SpaceParser}       from './SpaceParser'
import {BrowserWindow, ipcMain}     from 'electron'
import {CommandExecution} from './command/command-functions'

// const log = require('electron-log');
// log.transports.file.level = 'debug';
// log.transports.file.file = __dirname + 'log.log';
// log.debug(log)
import {tree} from './trees/desktop'


export class ProcessController {

	active      :boolean
	mainWindow  :BrowserWindow
	viewService :SingleViewService
	traversal   :TreeTraversal
	commandTrees
	dispatch :CommandExecution
	ipc
	path = 'display'
	socket :ProcessInterface
	view

	constructor(window) {
		console.log('created process controller')
		this.mainWindow  = window
		this.view        = new SingleViewService(window)
		this.viewService = new SingleViewService(this.view)
		log.debug('initializing process controller')
		this.commandTrees = {}
		this.start()
		/*this.socket =
			new ProcessInterface('6601')
				.on('standard')


		/*this.ipc = new RabbitServer(this.path)
			.on('tree', (content, replyCb) => {
				log.debug('received tree')
				let name = content['data']['symbol']
				this.commandTrees[name] = content
				//log.debug(this.commandTrees)
				//log.debug('added ' + name)
			})
			.on(['display', 'tree'], (content, replyCb) => {
				let requestedTree = this.commandTrees['standard']
				log.debug('received display request')
				if (requestedTree !== null) {
					//log.debug(requestedTree)
					this.run_traversal(requestedTree, replyCb)
				} else {
					log.error('couldn+\'t find a tree called ' + content)
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
				log.debug('received app tree')
				let requestedTree = this.commandTrees['app_specific'][content.name]
				log.debug('requested tree = '+content.name)
				if (requestedTree !== null)
					this.run_traversal(requestedTree, replyCb)
				else {
					log.debug('couldn+\'t find a tree called ' + content)
					replyCb({type: 'failed'})
				}
			})
			.createServer()*/
	}

	async start() {
		const parser = new SpaceParser('')
		this.commandTrees['standard'] =
			await parser.traverse(tree, 'standard')
		ipcMain.on('key', async (ev, key) => {
			await this.traversal.processKeyEvent(key)
		})
		this.dispatch = new CommandExecution(parser.commands)
		const dispatchCommand :Function =
			async (cmdId) => {
				log.debug('Sending command to dispatcher:')
				log.debug(cmdId)
				await this.dispatch.executeCommand(cmdId)
			}
		this.traversal = new TreeTraversal(
			this.dispatch,
			this.deactivateSelection,
			this.mainWindow
		)
		await this.run_traversal(this.commandTrees, ()=>{})
	}


	async processDisplayRequest(msg) {
		if (!msg.hasOwnProperty('subtype')) {
			log.error('Expected a subtype for display request')
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
					log.error('couldn+\'t find a tree called ' + msg.content)
				}
		}
	}


	async run_traversal(tree, replyFn) {
		console.log('run traverse')
		console.log(tree)
		console.log(typeof tree)
		console.log(tree['standard']['subtree'])
		console.log('after')
		/*this.mainWindow.addEventListener('keydown', (ev) => {
			//log.debug(ev)
			if (this.active) {
				try {
					this.traversal.processKeyEvent(ev.key)
				} catch (e) {
				}
			}
		}, true)*/
		console.log('activated selection')
		await this.activateSelection(tree, replyFn)
	}


	async activateSelection(tree, replyCb) {
		this.traversal.callback = replyCb
		await this.traversal.resetContext(tree['standard'])
		this.active = true
		this.mainWindow.show()
	}

	async deactivateSelection() {
		this.active = false
		this.mainWindow.hide()

		//// REPLACE

		//window.removeEventListener('keydown')
	}

	publishTraversalState(state) {

	}
}
log.debug('executing')
