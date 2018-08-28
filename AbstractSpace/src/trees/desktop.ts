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

const Web = (name :string, url :string) => {
    return Sh(name, `firefox ${url}`)
}

const cmds = {
	ranger: 'alacritty -e ranger',
	update: 'trizen -Syyu',
	python: 'alacritty -e ipython',
	ammonite: 'alacritty -e ammonite',
	intellij: 'intellij-idea-ultimate-edition'


}

export const tree = {
	lab: 'desktop',
	l: {
		lab: 'launch',
		b: Sh('vivaldi', 'vivaldi-stable'),
		d: {
			lab: 'development',
			p: Shl('python'),
			a: Shl('ammonite'),
			i: Shl('intellij')
		},
		e: Sh('vs code', 'code'),
		r: Sh('ranger', 'alacritty -e ranger'),
        f: Sh('firefox'),
        s: {
            lab: 'site',
            h: Web('hacker news', 'news.ycombinator.com'),
            n: {
                lab: 'news',
                a: Web('ars technica', 'arstechnica.com'),
                t: Web('ny times', 'nytimes.com')
            }
        },
		S: {
			lab: 'system',
			s: Sh('settings', 'systemsettings5')
		}
    },

	w: {
		lab: 'window',
		fn: 'fn($window)',
		c: Kde('Window Close', 'close'),
		m: Kde('Window Maximize', 'maximize'),
		h: Kde('Window Minimize', 'hide'),
        l: Kde('Window Quick Tile Left', 'left'),
        r: Kde('Window Quick Tile Right', 'right'),
		e: Kde('Expose', 'expose'),
		d: {
			lab: 'desktop',
			d: Kde('Switch One Desktop Down', 'down'),
            u: Kde('Switch One Desktop Up', 'up'),
            t: {
                lab: 'jump to',
                a: '1',
                r: '2',
                s: '3',
                t: '4',
            },
            m: {
                lab: 'move current',
                a: '1',
                r: '2',
                s: '3',
                t: '4',
            }
		}
	},

    p: {
        lab: 'projects',
    },

    n: {
        lab: 'notes'
    },

	s: {
		lab: 'system',
		u: '',
		l: {
			lab: 'logs',
		}
    },

}
