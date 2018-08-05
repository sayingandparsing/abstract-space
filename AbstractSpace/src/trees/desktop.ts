import {
	MsgCommandFacory,
	ShellCommand
} from '../cmd_types/command'


const Kde = (cmd :string, title ?:string) => {
	const name = (title) ? title : cmd
	const cmdStr = `qdbus org.kde.kglobalaccel /component/kwin invokeShortcut "${cmd}"`
	return new ShellCommand(
		name,
		cmdStr
	)
}

export const tree = {
	lab: 'desktop',
	w: {
		lab: 'window',
		fn: 'fn($window)',
		c: Kde('close'),
        m: Kde('maximize'),
        l: Kde('Window Quick Tile Left', 'left'),
        r: Kde('right'),
        e: Kde('Expose', 'expose')
	}
}
