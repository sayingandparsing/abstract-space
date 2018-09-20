#! /usr/bin/env node

import * as fs from 'fs'
//import * as net from 'net'
import { IpcServer, IpcSocket } from '../ipc'
import * as socketio from 'socket.io'
//import { Server } from 'http';
//mport * as http from 'http'
import * as express from 'express'
//import {Server} from 'ws'
import {processController} from '../..'
import { InputChainSelection, ICResultType } from './browser-msg-types';
//const server = require('http')


/* console.log('browser service outer scrope')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
io.on('connection', function (socket) {
  // #2 - This will run for the new connection 'socket' and set up its callbacks
  // #3 - send to the new client a 'hello' message
  socket.emit('test', 'hello from the server')
  socket.on('init', (data) => {
    // #6 - handle this clients 'clientData'
    console.log("received message TEST from client")
  })
})
server.listen(5437, () => {
  console.log("Server started: http://localhost:${port}")
}) */


export class BrowserService {

  //commandServer :net.Socket //:IpcServer
  io :socketio.Server
  socket :socketio.Socket
  server //:Server
  app
  requestEngagement :(a:string,b:string,c:Function)=>Promise<boolean>

	constructor(requestEngagement :(a:string,b:string,c:Function)=>Promise<boolean>) {
    this.requestEngagement = requestEngagement
    this.app = express()
    this.server = require('http').Server(this.app)
    this.io = socketio(this.server)
    this.io.on('connection', (socket) => {
      console.log("connected to socket")
      socket.on('test', (msg) => {
        console.log('MESSAGE RECEIVED!!!!!!!!!!!!!!!!!!!!!!!!')
      })
      this.io.emit('test', {thiss: 'works'})
    })

    this.io.on('message', () => {
        console.log("msg.type")
    })
    this.server.listen(5437, () => {
      console.log('server listening')
    })

		/*this.commandServer.on('data', async () => {
			//fs.writeFile('/home/reagan/test/gotIt.txt', 'one instance', ()=>{})
			await this.sendMessage(JSON.stringify({text:'hello firefox'}))
		})*/

				//new IpcSocket(port).createConnection()
					// .on('command', async (msg) => {
					// 	await this.sendMessage(JSON.stringify({text: msg.command}))
					// })
  }

  async setupMessageHandlers(socket :socketio.Socket) {
    socket.on('ChainRequest', async () => {
      const status :boolean = await this.requestEngagement (
        'browser',
        'browser',
        (command :string) => {
          const msg :InputChainSelection = {
            type: ICResultType.RESOLVED,
            action: {
              name: command
            }
          }
          this.io.emit('InputChainResult', msg)
        })
    })
  }

	async sendMessage(msg :string) {
		let buffer :Buffer = Buffer.from(msg, 'utf-8')
		let len = buffer.length
		//fs.writeFile('/home/reagan/test/nativeMessReply.txt', len.toString() + '\n'+msg, ()=>{})
		let lenBuff :Buffer = Buffer.alloc(4);
		lenBuff.writeUInt32LE(len, 0)
		process.stdout.write(Buffer.concat([lenBuff, buffer]))
	}


	/*  _decoder() {
    let arr = [];
    if (Buffer.isBuffer(this._input)) {
      !this._length && this._input.length >= BYTE_LEN && (
        this._length = IS_BE && this._input.readUIntBE(0, BYTE_LEN) ||
                       this._input.readUIntLE(0, BYTE_LEN),
        this._input = this._input.slice(BYTE_LEN)
      );
      if (this._length && this._input.length >= this._length) {
        const buf = this._input.slice(0, this._length);
        arr.push(JSON.parse(buf.toString(CHAR)));
        this._input = this._input.length > this._length &&
                      this._input.slice(this._length) || null;
        this._length = null;
        if (this._input) {
          const cur = this._decoder();
          cur.length && (arr = arr.concat(cur));
        }
      }
    }
    return arr;
  }

  decode(chunk) {
    const buf = (isString(chunk) || Buffer.isBuffer(chunk)) &&
                  Buffer.from(chunk);
    let msg;
    buf && (
      this._input = Buffer.isBuffer(this._input) &&
                    Buffer.concat([this._input, buf]) || buf
    );
    Buffer.isBuffer(this._input) && this._input.length >= BYTE_LEN &&
      (msg = this._decoder());
    return Array.isArray(msg) && msg || null;
  }*/

}

//const proxy = new ChromeMessageProxy('6542')

