import {ProcessInterface, IpcSocket} from '../ipc'

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
		firefox: '6542'
	}

	constructor (
		commands :{[key:number]:Command}
	) {
		this.commands = commands
		Object.entries(this.ports).forEach(([k,v]) =>
				this.services[k] = new IpcSocket(v)
		)
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
