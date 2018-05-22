from typing import (
    Sequence,
    Any,
    Callable,
    Iterable,
    Dict,
    Union
)
import subprocess
from rutils.multimethod import Multimethod as MM

#from .command_index import CommandIndex

applications = {
    'vivaldi': 'vivaldi-stable',
    'google': 'google-chrome-stable',
    'idea': 'intellij-idea-ultimate-edition',
    'terminal': 'tilix',
    'atom': 'atom',
    'process monitor': 'ksysguard',
}

i3 = {
    'close': 'kill',
    'forward': 'focus right',
    'back': 'focus left'
}

kde = {
    'close': 'Window Close',
    'maximize': 'Window Maximize',
    'left': 'Window Quick Tile Left',
    'right': 'Window Quick Tile Right',
    'expose': 'ExposeAll'
}

keys = {
    'viv': {
        'new tab': '^t',
        'reopen tab': '^+Tab',
        'close tab': '^w',
        'tab left': '^PageUp',
        'tab right': '^PageDown',
        'close tabs left': '^!t',
        'close tabs right': '^!+t',
        'close other tabs': '^!#t',
        'settings': '!p',
        'extensions': '^+e',
        'history': '^h'
    },
    'win': {
        'close': '!x',
        'maximize': '#+m',
        'left': '#+l',
        'right': '#+r',
        'overview': '^F8'

    }
}

class CommandType:

    def __init__(self, name):
        self.name = name


    def resolve_and_execute(self):
        pass

class App(CommandType):
    exec_index: Dict[str, str] = applications

    def __init__(self, name: str):
        CommandType.__init__(self, name)

class Key(CommandType):
    def __init__(self, name: str, context: str):
        CommandType.__init__(self, name)
        self.name = name
        self.context = context

class I3(CommandType):
    def __init__(self, name: str):
        CommandType.__init__(self, name)
        self.name = name

class Kde(CommandType):
    def __init__(self, name: str):
        CommandType.__init__(self, name)
        self.name = name



tree = {
    'l': {
        'label': 'launch application',
        'b': App('vivaldi'),
        'e': App('atom'),
        'o': App('google'),
        'i': App('idea'),
        't': App('terminal'),
        'a': {
            'label': 'administrative',
            'm': App('process monitor')
        }
    },
    'w': {
        'label': 'windows',
        #'prefix': ['win'],
        # 's': Key('select'),
        'c': Kde('close'),
        'm': Kde('maximize'),
        'l': Kde('left'),
        'r': Kde('right'),
        'e': Kde('expose')
    }
}





def path(query: str) -> Any:
    pass




# class BranchOrTerm(Multimethod):
#
#     def __init__(self):
#         super().__init__()


class IdDispensory:

    def __init__(self):
        self._next_available = 0

    def available(self) -> int:
        id = self._next_available
        self._next_available += 1
        return id



class ConstantLoader(dict):

    def __init__(self):
        super().__init__()

        self.config_dir = ''
        contents = {
            'applications': self.load_file('applications.yaml'),
            'keys': self.load_file('keybind.yaml')
        }

    def load_file(self, file):
        pass


class CommandTreeTraversal:

    def __init__(self):#, cmd_methods: Multimethod = CommandMethods):
        self.command_index = {}
        self.ids = IdDispensory()
        self.constants = {'applications': applications,
                          'i3': i3,
                          'keys': keys,
                          'kde': kde
                          }
        self.mod_sub = {
            '^': 'ctrl',
            '+': 'shift',
            '!': 'alt',
            '#': 'meta'
        }

        #ConstantLoader()
        self.tree = self.traverse(tree, 'standard')



    def partition(self, seq: Iterable,
                  predicate: Callable[[Any],bool],
                  rtype='tuple'):
        yes, no = [], []
        for i in seq:
            (yes if predicate(i) else no).append(i)
        if rtype is not 'tuple':
            return {True: yes,
                    False: no}
        else:
            return yes, no


    def traverse(self,
                 tree: Union[dict, CommandType],
                 symbol: str) -> Dict:

        metadata_fields = ['label', 'prefix']

        def is_command(node) -> bool:
            return ('command' in node.__dict__().keys())

        if isinstance(tree, dict):
            result = {}
            metadata, subnodes = self.partition(
                tree.items(),
                lambda _: _[0] in metadata_fields
            )
            metadata.append(('symbol', symbol))
            result['data'] = {k: v for k, v in metadata}
            subtrees = []
            for sym, branch in subnodes:
                tree = self.traverse(branch, sym)
                subtrees.append(tree)
            result['subtree'] = subtrees
            return result

        else:
            result: dict = self.handle_command(tree, symbol)
            return result

    def handle_command(self, command: CommandType,
                       symbol: str
                       ) -> Dict[str, Any]:
        id: int = self.ids.available()
        metadata = self.process_command(command, id)
        metadata['symbol'] = symbol
        return {
            'data': metadata,
            'command': id
        }

    def substitute_mods(self, key_seq):
        for k,v in self.mod_sub.items():
            key_seq = key_seq.replace(k, v+'*')
        key_seq = key_seq.replace('*', '+')
        return key_seq

    def process_command(self, command, id):

        instance_of = lambda typ: isinstance(command, typ)

        cmd = {}

        if instance_of(App):
            exe = self.constants['applications'][command.name]
            cmd = {
                'type': 'shell',
                'arg': exe
            }

        elif instance_of(Key):
            key_seq = self.constants['keys'][command.context][command.name]
            cmd = {
                'type': 'key',
                'arg': self.substitute_mods(key_seq)
            }

        elif instance_of(I3):
            cmd_str = self.constants['i3'][command.name]
            cmd = {
                'type': 'shell',
                'arg': 'i3-msg ' + cmd_str
            }

        elif instance_of(Kde):
            try:
                cmd_name = self.constants['kde'][command.name]
                cmd_str = 'qdbus org.kde.kglobalaccel /component/kwin invokeShortcut "%s"' % cmd_name
                cmd = {
                    'type': 'shell',
                    'arg': cmd_str
                }
            except Exception as e:
                print('Failed to lookup KDE command: '+ command.name)

        if not cmd == {}:
            self.command_index[id] = cmd

        return {'label': command.name}


# class CommandMethods(MM):
#
#     def __init__(self, constants):
#         super().__init__(self)
#         self.constants = constants
#
#
#     def form_command(typ :String,
#                      arg :String
#                      ) -> Dict:
#         return {
#             'type': typ,
#             'arg': arg
#         }
#
#
#     @MM.type_map(App)
#     def app(self, command):
#         exe :String = self.constants['applications'][command.name]
#         return self.form_command('shell', exe)
#
#
#     @MM.type_map(Key)
#     def key(self, command):
#         key_seq = self.constants['keys']\
#                                 [command.context]\
#                                 [command.name]
#         return self.form_command('key', key_seq)
#
#
#     @MM.type_map(Kde)
#     def kde(self, command):
#         cmd = self.constants['']
#
#
#
#
# def assign_commandID():
#     pass
