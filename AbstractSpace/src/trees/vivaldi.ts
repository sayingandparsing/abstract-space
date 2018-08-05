import {KeyCommand as K} from '../cmd_types/command'


const tree = {
	v: {
		lab: 'vivaldi',
		t: {
			lab: 'tab',
			fn: 'fn(tab)',
			l: new K('left','c.PageUp'),
			r: new K('right','c.PageDown'),
			n: new K('new','c.t'),
			w: {
				lab: 'window',
				fn: 'fn(window.as(tab))',
				n: new K('new','c.n'),
				k: new K('kill','c.s.w')
			},
			k: {
				lab: 'kill',
				fn: '+kill(tab.which($x))',
				c: new K('current','c.w'),
			}
		},
		v: {
			lab: 'view',
			fn: '+open($view)',
			b: new K('bookmarks','c.b'),
			d: new K('downloads','c.d'),
			e: new K('extensions','c.s.e'),
			h: new K('history','c.h'),
			s: new K('settings','a.p'),
		}
	}

}
