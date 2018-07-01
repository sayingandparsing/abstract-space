import * as net from 'net'

export class ProcessInterface {

	socket: net.Socket
	port: string
	dataHooks

	constructor(port: string,
				dataHooks: {[key: string]: Function} = {}) {
		this.port = port
		this.dataHooks = dataHooks

	}

	createConnection(port: string) {
		this.socket = net.createConnection(
			port,
			(sock) => {
				sock.on('data', (msg) => {
					this.handleIncoming(this.parse(msg))
				})
			}
		)
	}

	handleIncoming(msg) {
		let {type, data} = msg
		console.log('reveived message through socket:')
		console.log(msg)
		this.dataHooks[type](data)
	}

	on(type: string, fn: Function) {
		this.dataHooks[type] = fn
		return this
	}

	parse(data: string): object {
		return JSON.parse(data.trim())
	}

	send(typ: string,
		 content: object|string,
		 meta: object = null) {
		this.socket.write({
			type: typ,
			content: content,
			meta: meta
		}.toString())
	}
}

export class IpcServer {

	path
	server
	dataHooks = {}

	constructor(path) {
		this.path = path
	}

	createServer() {
		this.server = net.createServer()
		this.server.listen(this.path)
		this.server.on('connection', (socket) => {
			socket.on('message', (msg) => {
				this.handleIncoming(
					this.parse(msg),
					socket
				)
			})
		})
	}

	handleIncoming(msg, socket) {
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
				console.log('created channel')
				ch.consume(this.name, (msg) => {
					this.handleIncoming(
						this.parse(msg),
						(reply) => {
							console.log('relied to sender')
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
			console.log('received message: ' + type)
			let subtype
			if (msg.hasOwnProperty('subtype')) {
				subtype = msg['subtype']
			} else {
				subtype = null
			}
			//console.log('type: ' + type + ', content: ' + content + ', subtree: ' +subtype)
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
