import {ProcessInterface, IpcSocket} from '../ipc'
import * as http from 'http'
import * as socketio from 'socket.io'
import * as express from 'express'

import {
	Command,
	ShellCommand,
	MsgCommand
} from '../cmd_types/command'
import * as child_process from 'child_process'
import {log} from '../util/logger'
import { Shell } from 'electron';


export class CommandExecution {

	services :{[key:string]: IpcSocket} = {}
	commands :{[key:number]: Command}
	ports :{[key:string]: string} = {
		//firefox: '6542'
    }
    io :socketio.Server
    app
    server :http.Server

	constructor (
		commands :{[key:number]:Command}
	) {
        log.debug('initializing command execution module')
		this.commands = commands
		/*Object.entries(this.ports).forEach(([k,v]) =>
				this.services[k] = new IpcSocket(v)
        )*/
        this.app = express()
        this.server = http.createServer(this.app)
        this.server.listen(6542, '127.0.0.1')
        this.io = socketio(this.server)
        this.io.on('connection', () => {
            this.io.emit('test')
        })
	}

	async keyseq() {

    }

	async message(service :string, msg :Object) {
		try {
			await this.services[service].send(msg)
		}
		finally {}
	}

	async executeCommand(id :number) {
		const cmd = this.commands[id]
		if (!cmd)
			return
		log.debug('Checking command type')
		if (cmd instanceof ShellCommand) {
			log.debug('Executing shell command: ')
			log.debug((<ShellCommand>cmd).cmd)
			await this.executeShellCommand(<ShellCommand>cmd);
		}
		else
		if (cmd instanceof MsgCommand) {
			try {
				await this.services[cmd.recip].send(cmd.msg)
			}
			finally {}
		}


	}

	async executeShellCommand(cmd :ShellCommand) {
		child_process.exec(cmd.cmd)
	}

	async disconnectAll() {

	}
}
