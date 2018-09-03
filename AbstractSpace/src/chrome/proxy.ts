#! /usr/bin/env node

import * as fs from 'fs'
import * as net from 'net'
import { IpcServer, IpcSocket } from '../ipc'
import * as socketio from 'socket.io-client'

class ChromeMessageProxy {

  commandServer :net.Socket //:IpcServer
  io :SocketIOClient.Socket

	constructor(port :string) {
		process.stdin.on('readable', async () => {
			//fs.appendFile('/home/reagan/test/nativeMess.txt', 'one instance', ()=>{})
			//await this.sendMessage(JSON.stringify({text:'hello firefox'}))
		})
    this.io = 
        socketio
            .connect('http://localhost:6542')
    this.io.on('connect', async () => await this.sendMessage(JSON.stringify({text:'connected'})))
    this.io.on('test', async () => await this.sendMessage(JSON.stringify({text:'test worked'})))
		/*this.commandServer.on('data', async () => {
			//fs.writeFile('/home/reagan/test/gotIt.txt', 'one instance', ()=>{})
			await this.sendMessage(JSON.stringify({text:'hello firefox'}))
		})*/

				//new IpcSocket(port).createConnection()
					// .on('command', async (msg) => {
					// 	await this.sendMessage(JSON.stringify({text: msg.command}))
					// })
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

const proxy = new ChromeMessageProxy('6542')

