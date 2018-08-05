import {ProcessInterface} from '../ipc'
import {
	Command,
	ShellCommand
} from '../cmd_types/command'
import * as child_process from 'child_process'
import {log} from '../util/logger'
import { Shell } from 'electron';

export class CommandExecution {

	sockets :ProcessInterface[]
	services :Map<string,Function>
	commands :{[key:number]:Command}

	constructor(commands :{[key:number]:Command}) {
		this.commands = commands
	}

	async keyseq() {

	}

	async message(service :string, type :String, message) {
		try {
			this.services[service](type, message)
		} finally {}
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


	}

	async executeShellCommand(cmd :ShellCommand) {
		child_process.exec(cmd.cmd)
	}
}
