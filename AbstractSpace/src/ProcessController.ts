
import {TreeTraversal}     from './TreeTraversal'
import {ProcessInterface, IpcServer}  from './ipc'
import {SingleViewService} from './SingleViewService'
import {log}               from './util/logger'
import {SpaceParser}       from './SpaceParser'
import {BrowserWindow, ipcMain}     from 'electron'
import {CommandExecution} from './command/command-functions'
import {loadTrees} from './trees/load-trees'
import {ipcEvents} from './ipc/ipc-events'
import {BrowserService} from './clients/proxy'

import keyEventEmitter from './events/keyEvents'
//import {Constants as C} from './constants'

// const log = require('electron-log');
// log.transports.file.level = 'debug';
// log.transports.file.file = __dirname + 'log.log';
// log.debug(log)
export interface Context {
    path: string[]
    tree: string
}

export class ProcessController {

    active      :string|null
    mainWindow  :BrowserWindow
    viewService :SingleViewService
    traversal   :TreeTraversal
    commandTrees :Object
    dispatch :CommandExecution
    requestListener :IpcServer
    ipc
    path = 'display'
    socket :ProcessInterface
    view
    context
    savedRefs :Object = {}
    browserService :BrowserService
    internalActive :boolean = false
    externalActive :boolean = false

    constructor(window) {
        console.log('created process controller')
        this.mainWindow  = window
        this.view        = new SingleViewService(window)
        this.viewService = new SingleViewService(this.view)
        log.debug('initializing process controller')
        this.commandTrees = {}

        this.start()
    }

    async start() {
        const parser = new SpaceParser('')
        log.debug('loading trees')
        loadTrees().forEach(async config => {
            try {
                log.debug("LABEL: "+config.tree.lab)
                const lab = config.tree.lab
                this.commandTrees[lab] =
                    await parser.traverse(config.tree, config['tree']['lab'])
                //console.log('COMMAND TREE:')
            }
            catch (err) {
                log.error('CONFIG WARNING: tree not loaded')
                console.log(err)
            }
        })
        log.debug('done loading trees')

        this.dispatch = new CommandExecution(parser.commands)

        log.debug('created command execution')
/*         const dispatchCommand :Function =
            async (cmdId) => {
                log.debug('Sending command to dispatcher:')
                log.debug(cmdId)
                await this.dispatch.executeCommand(cmdId)
            } */
        this.traversal = new TreeTraversal(
            this.dispatch,
            this.deactivateSelection,
            this.mainWindow
        )
        log.debug('Creating request listener')
        this.requestListener =
            new IpcServer('6602')
                .on('tree', async msg => {
                    log.debug('received tree request')
                    const tree = this.commandTrees[msg]
                    if (tree!==undefined) {
                        this.active = 'main'
                        await this.runTraversal(tree)
                    }
                    else
                        log.debug('no tree found for request '+msg)

                })
                .on('reload', async msg => await this.reload())
                .on('quit', () => {
                    ipcEvents.emit('disconnect')
                })
                //console.log('%j', this.commandTrees)
                //for (let i of Object.keys(this.commandTrees)) console.log(i)

        //await this.run_traversal(this.commandTrees, ()=>{})
            ipcMain.on('key', async (ev, key :string) => {
                if (this.active==='main')
                    await this.traversal.processKeyEvent(key)
            })

            log.debug('starting browser service')
            this.browserService = new BrowserService(this.requestEngagement)
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

    async requestEngagement (
        treeName :string,
        clientName :string,
        replyFn
    ) :Promise<boolean> {
        if (this.active)
            return false
        const tree :object|null = this.commandTrees[treeName]
        if (tree) {
            this.active = clientName
            // MAY FAIL DUE TO BLOCKED RETURN
            this.runTraversal(tree, replyFn)
            return true
        }
        else {
            log.error(`The tree "${treeName}" `+
                    `requested by "${clientName} doesn't exist`)
            return false
        }
    }

    async runTraversal(tree, replyFn?) {
        if (replyFn)
            await this.traversal.resetContext(tree, replyFn)
        else
            await this.traversal.resetContext(tree)
        this.mainWindow.show()
        if (this.active==='main')
            this.mainWindow.focus()
    }


    async deactivateSelection() {
        this.active = null
        this.mainWindow.hide()

        //// REPLACE

        //window.removeEventListener('keydown')
    }

    publishTraversalState(state) {

    }

    async reload() {
        log.debug('Reloading configuration')
        ipcEvents.emit('disconnect')
        await this.sleep(3000)
        await this.start()
    }

    async sleep(ms) {
        return new Promise(resolve=>{
            setTimeout(resolve,ms)
        })
    }
}
log.debug('executing')
