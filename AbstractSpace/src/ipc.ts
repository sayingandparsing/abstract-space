import * as net from 'net'
import {log} from './util/logger'
import {ipcEvents} from './ipc/ipc-events'
import {EventEmitter} from 'events'

export class ProcessInterface {

    socket: net.Socket
    port: string
    dataHooks

    constructor(port: string,
                dataHooks: {[key: string]: Function} = {}) {
        this.port = port
        this.dataHooks = dataHooks
        log.debug('Created ProcessInterface')
        this.createConnection(this.port)
    }

    createConnection(port: string) {
        log.debug('creating ipc socket on port '+port)
        this.socket = net.createConnection(
            port,
            (sock) => {
                sock.on('data', (msg) => {
                    log.debug('ProcessInterface received a message')
                    this.handleIncoming(this.parse(msg))
                })
            }
        )
    }

    handleIncoming(msg) {
        log.debug('handling incoming message')
        let {type, data} = msg
        this.dataHooks[type](data)
    }

    on(type: string, fn: Function) {
        this.dataHooks[type] = fn
        return this
    }

    parse(data: string): object {
        return JSON.parse(data.trim())
    }

    send(
        typ: string,
        content: object|string,
        meta: object = null
    ) {
        this.socket.write({
            type: typ,
            content: content,
            meta: meta
        }.toString())
    }
}

export class IpcServer {

    path
    server :net.Server
    dataHooks = {}
    ipcEvents :EventEmitter = ipcEvents

    constructor(path) {
        this.path = path
        log.debug('creating server on '+this.path)
        this.createServer()
        ipcEvents.on('disconnect', () => this.disconnect())
    }

    createServer() {
        this.server = net.createServer(connect => {
            connect.on('data', (data) => {
                log.debug('received data on ' +this.path)
                log.debug(data.toString('utf-8'))
                try {
                    this.handleIncoming(this.parse(data.toString('utf-8')), connect)
                } catch (e) {
                    log.debug(e.message)
                }
            }
        )
        })
        this.server.listen(this.path)
        /*this.server.on('connection', (socket) => {
            socket.on('message', (msg) => {
                this.handleIncoming(
                    this.parse(msg),
                    socket
                )
            })
        })*/
    }

    handleIncoming(msg, socket) {
        log.debug(typeof msg)
        //const msgObj = JSON.parse(msg)
        let {type, content} = msg
        this.dataHooks[type](content)
    }

    on(type: string, fn: Function) {
        this.dataHooks[type] = fn
        return this
    }

    parse(data: string): object {
        return JSON.parse(data)
    }

    disconnect() {
        log.debug('IpcServer disconnecting from port '+ this.path)
        this.server.close()
    }

}


export class IpcSocket {

    port :string
    socket :net.Socket
    ipcEvents :EventEmitter = ipcEvents

    constructor(port :string) {
        this.port = port
        this.createConnection()
        ipcEvents.on('disconnect', () => this.disconnect())

    }

    createConnection() {
        this.socket = new net.Socket({
            readable: true,
            writable: true,
            allowHalfOpen: true
		})
		this.socket.connect({
			port: Number.parseInt(this.port)
		})
    }

    async send(msg :Object) {
        this.socket.write (
            Buffer.from (
                JSON.stringify(msg)
            )
        )
    }
    disconnect() {
        log.debug('IpcSocket disconnecting from port '+ this.port)
        this.socket.destroy()
    }
}

let amqp = require('amqplib/callback_api');

export class RabbitServer {

    name
    dataHooks = {}

    constructor(name) {
        this.name = name
    }

    createServer() {
        amqp.connect('amqp://localhost', (err, conn) => {
            conn.createChannel((err, ch) => {
                ch.assertQueue(this.name, {durable: false})
                log.debug('created channel')
                ch.consume(this.name, (msg) => {
                    this.handleIncoming(
                        this.parse(msg),
                        (reply) => {
                            log.debug('replied to sender on queue')
                            let replyBuff =
                                new Buffer(JSON.stringify(reply))
                            ch.sendToQueue(
                                //'daemon',
                                msg.properties.replyTo,
                                replyBuff///w Buffer(replyStr),
                                //{correlationId: msg.properties.correlationId}
                            )
                        }
                    )
                    ch.ack(msg)
                })
            })
        })
    }

    handleIncoming(msg, replyCb) {
            let type = msg['type'],
                content = msg['content']
            log.debug('received cue message: ' + type)
            let subtype
            if (msg.hasOwnProperty('subtype')) {
                subtype = msg['subtype']
            } else {
                subtype = null
            }
            //log.debug('type: ' + type + ', content: ' + content + ', subtree: ' +subtype)
            if (subtype !== null) {
                let f = this.dataHooks[type][subtype]
                f(content, replyCb)
            } else {
                let f = this.dataHooks[type]
                f(content, replyCb)
            }
    }

    on(type: string | Array<string>, fn: Function) {
        if (typeof(type)==='string') {
            this.dataHooks[type] = fn
        }
        else {
            let subtype
            let type2 = type[0]
            subtype = type[1]
            this.dataHooks[type2] = {}
            this.dataHooks[type2][subtype] = fn
        }
        return this
    }

    parse(data): object {
        return JSON.parse(data.content.toString('utf-8'))
    }

}
