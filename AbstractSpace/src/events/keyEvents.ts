

import {EventEmitter} from 'events'
import {SourcedKeyEvent} from '../types/keyEvents'

export interface ChainInfo {
    source :string
    treeName :string
}

export class KeyEventsEmitter extends EventEmitter {

    constructor() {
        super()
    }

    async emitKey(event :SourcedKeyEvent) :Promise<void> {
        this.emit('key-event', event)
    }

    async emitChainInit(event :ChainInfo) {
        this.emit('init-chain', event)
    }

}

export default new KeyEventsEmitter()
