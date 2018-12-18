/**
 * Created by rmacc on 5/2/2017.
 */

import {EventEmitter} from 'events'
import {
    DescentContext,
    NodeData,
    DynamicNode,
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
import { Observable } from 'rxjs'


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
            let current = this.context.current as PathNode
            this.context.current = current.subtree [
                current.subtree.map(node => node.data.symbol).indexOf(key)
            ]
            console.log(this.context.current)
            const currentNode :AnyNode = this.context.current
            if (this.isTerminal(currentNode)) {
                log.debug("Node is terminal")
                let term = currentNode as TermNode
                console.log(term.command)
                if (this.context.commandCb)
                    await this.context.commandCb(term.command)
                else
                    // CAST VALID?
                    await this.execution.executeCommand(<number>term.command)
                this.deactivate()
                return
            }
            else if (await this.branches(currentNode)) {

                let level = await this.extractLevel(currentNode as PathNode)
                if (level) {
                    this.context.level = level
                    log.debug('updating view state')
                    this.mainWindow.webContents.send('update', level)
                }
                else {
                    /*this.callback({
                        type: 'failure',
                        path: this.context.path
                    })*/
                    this.deactivate()
                    return
                }
            }
            else if (await this.isDynamic(currentNode)) {
                let level :NodeData[] = (currentNode as DynamicNode).resolve()
            }
        }
        else {

        }
    }

    async selectionResponse(obs :Observable<NodeSymbol>) {
        const specType = null
        const processNextSignal = async () => {
            switch (specType) {

            }
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


    async planResponseToNextEvent(
            currentNode,
            currentType :'PathNode'|'DynamicNode'
    ) {
        switch (currentType) {
            case 'PathNode':

        }
    }


    async extractLevel(node :PathNode) :Promise<Connections> {
        return node.subtree.map(desc => desc.data);
    }


    isTerminal(node :AnyNode) :boolean {
        log.debug("Checking if node is terminal")
        return (<TermNode>node).command !== undefined
    }

    async branches(node :AnyNode) :Promise<boolean> {
        return (<PathNode>node).subtree !== undefined
    }

    async isDynamic(node: AnyNode) {
        return (<DynamicNode>node).resolve !== undefined
    }


/*    sendKeyEvent() :NodeSymbol {

    }*/

}
