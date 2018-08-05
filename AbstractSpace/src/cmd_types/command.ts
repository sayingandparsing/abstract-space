
export abstract class Command {
	name
	constructor(name :string) {
		this.name = name
	}
}

export type CmdType
	= MsgCommand
	| KeyCommand
	| ShellCommand

export class KeyCommand extends Command {
	cmd :string
	constructor(name :string, cmd :string) {
		super(name)
		this.cmd = cmd
	}
}

export class MsgCommand extends Command {
	msg
	recip
	constructor(
		name :string,
		msg :string,
		recip :string
	) {
		super(name)
		this.msg = msg
		this.recip
	}
}

export const MsgCommandFacory = (recip) => {
	return (name :string, msg :string) =>
		new MsgCommand(name, msg, recip)
}

export class ShellCommand extends Command {
	cmd :string

	constructor (
		name :string,
		cmd :string
	) {
		super(name)
		this.cmd = cmd
	}
}
