#! /usr/bin/env node

import * as fs from 'fs'
import {IpcServer} from '../ipc'

class ChromeMessageProxy {

	commandServer :IpcServer

	constructor(port :string) {
		process.stdin.on('readable', () => {
			fs.writeFile('/home/reagan/test/nativeMess.txt', ' ', ()=>{})
			this.sendMessage(JSON.stringify({text:'I am alone in this world'}))
		})
		this.commandServer =
				new IpcServer(port)
					.on('command', async (msg) => {
						await this.sendMessage(JSON.stringify({text: msg.command}))
					})
	}

	async sendMessage(msg :string) {
		fs.writeFile('/home/reagan/test/nativeMessReply.txt', ' ', ()=>{})
		let buffer :Buffer = Buffer.from(msg, 'utf-8')
		let len = buffer.length
		let lenBuff :Buffer = Buffer.alloc(4);
		lenBuff.writeInt32LE(len, 0)
		process.stdout.write(Buffer.concat([lenBuff, buffer]))
	}

}

const proxy = new ChromeMessageProxy('6888')

