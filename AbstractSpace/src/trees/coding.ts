import {
	Command,
	KeyCommand,
	MsgCommand,
	MsgCommandFacory
} from '../cmd_types/command'

const Cmd = MsgCommandFacory('vivaldi')


export const tree = {
	f: {
		lab: 'format',
		fn: 'format::fn($obj)',
		c: {
			lab: 'call'

		},
		f: {
			lab: 'function',
			fn: 'format::fn(function)',
			p: {
				lab: 'parameters'

			}
		}
	},
	s: {
		lab: 'search',
		fn: 'search($obj)[.in($cxt)]',
		l: Cmd('line', 'select-line'),
		s: {
			lab: 'symbol',
			p: Cmd('in project', 'search-sym-project'),
			f: Cmd('in file', 'search-sym-file'),
		},
		f: {
			lab: 'file',
			'o': Cmd('open', 'search-open-file'),
			'p': Cmd('in project', 'search-project-file'),
		},
		m: {
			lab: 'mark'
		},
		o: {
			lab: 'object'
		}
	}
}
