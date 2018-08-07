import {
	MsgCommandFacory,
	ShellCommand
} from '../cmd_types/command'
import { createEnumDeclaration } from 'typescript';


const Kde = (cmd :string, title ?:string) => {
	const name = (title) ? title : cmd
	const cmdStr = `qdbus org.kde.kglobalaccel /component/kwin invokeShortcut "${cmd}"`
	return new ShellCommand(
		name,
		cmdStr
	)
}

const Sh = (name :string, cmd?: string) =>
	new ShellCommand(
		name,
		(cmd)
			? cmd
			: name
	)
const Shl = (name :string) => {
	try {
		const cmd = cmds['name']
		return Sh(name, cmd)
	} catch {
		return null
	}
}

const cmds = {
	'ranger': 'alacritty -e ranger',
	'update': 'trizen -Syyu'

}

export const tree = {
	lab: 'desktop',
	l: {
		lab: 'launch',
		b: Sh('vivaldi', 'vivaldi-stable'),
		e: Sh('vs code', 'code'),
		r: Shl('ranger')


	},
	w: {
		lab: 'window',
		fn: 'fn($window)',
		c: Kde('close'),
        m: Kde('maximize'),
        l: Kde('Window Quick Tile Left', 'left'),
        r: Kde('Window Quick Tile Right', 'right'),
        e: Kde('Expose', 'expose')
	},

	s: {
		lab: 'system',
		u:
	}
}
