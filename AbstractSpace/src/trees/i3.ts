import {
	MsgCommandFacory,
	ShellCommand
} from '../cmd_types/command'
import { createEnumDeclaration } from 'typescript';


const i3 = (cmd :string, title ?:string) => {
	const name = (title) ? title : cmd
	const cmdStr = `i3-msg "${cmd}"`
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
		c: i3('Window Close', 'close'),
		m: i3('Window Maximize', 'maximize'),
		h: i3('Window Minimize', 'hide'),
        l: i3('Window Quick Tile Left', 'left'),
        r: i3('Window Quick Tile Right', 'right'),
		e: i3('Expose', 'expose'),
		d: {
			lab: 'desktop',
			d: i3('Switch One Desktop Down', 'down'),
            u: i3('Switch One Desktop Up', 'up'),
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
