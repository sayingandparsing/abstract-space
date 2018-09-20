/**
 * Created by rmacc on 5/2/2017.
 */

import {EventEmitter} from 'events'
import {
    DescentContext,
    NodeData,
    PathNode,
    TermNode,
    Connections,
    NodeSymbol, AnyNode, RootNode, ProcessState
} from "./types/DataTypes"
import {log} from './util/logger'
import {BrowserWindow} from 'electron'
import { CommandExecution } from "./command/command-functions";
import keyEventEmitter, { ChainInfo } from './events/keyEvents'
import { SourcedKeyEvent } from './types/keyEvents';


export class TreeTraversal {
    //context :DescentContext;
    context :DescentContext
    viewEmitter = new EventEmitter()
    execution: CommandExecution
    deactivate
    mainWindow :BrowserWindow
    activeClient :string|null = null

    //type NodeSymbol = String

    constructor (
            execution :CommandExecution,
            deactivate :Function,
            window :BrowserWindow
    ) {
        this.deactivate = deactivate
        this.mainWindow = window
        this.execution = execution
        console.log('new traverser')
    }

    async resetContext(nodePtr :RootNode, execute? :Function)
    {
        console.log('resetting context')
        this.context = {
            root: nodePtr,
            current: nodePtr,
            level: nodePtr.subtree.map(item => item.data),
            path: [],
            commandCb: (execute) ? execute : null
        }
        console.log(this.context.level)
        console.log('sending update command')
        this.mainWindow.webContents.once('dom-ready', () => {
            console.log('dom ready')
            this.mainWindow.webContents.send('update', this.context.level)
        })
        this.mainWindow.webContents.send('update', this.context.level)
    }

    async processKeyEvent(key :NodeSymbol)
    {
        log.debug('Key press detected: '+key)
        if (key === 'Escape') {
            log.debug("Terminated")
            /*this.callback({
                type: 'failed',
                path: this.context.path
            })*/
            this.deactivate()
            return
        }
        let symbols = this.context.level.map(node => node.symbol)
        if (symbols.indexOf(key) > -1) {
            log.debug("Symbol found for transmitted key")
            this.context.path.push(key)
            let current = <PathNode> this.context.current
            this.context.current = current.subtree[current.subtree.map(
                node => node.data.symbol).indexOf(key)]
            console.log(this.context.current)
            if (this.isTerminal(
                    <PathNode|TermNode> this.context.current)) {
                log.debug("Node is terminal")
                let term = <TermNode> this.context.current
                console.log(term.command)
                if (this.context.commandCb)
                    await this.context.commandCb(term.command)
                else
                    await this.execution.executeCommand(term.command)
                this.deactivate()
                return

            } else {

                let level = this.extractLevel(
                    <PathNode> this.context.current)
                if (level) {
                    this.context.level = level
                    log.debug('updating view state')
                    this.mainWindow.webContents.send('update', level)
                } else {
                    /*this.callback({
                        type: 'failure',
                        path: this.context.path
                    })*/
                    this.deactivate()
                    return
                }
            }
        }
        else {

        }
    }


    sendShutdownSignal()
    {

    }


    async connectedTo (
            n :PathNode,
            sym :NodeSymbol
    ) :Promise<boolean> {
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
        log.debug("Checking if node is terminal")
        return (<TermNode>node).command !== undefined
    }


/*    sendKeyEvent() :NodeSymbol {

    }*/

}
