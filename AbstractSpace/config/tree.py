from typing import  Sequence, Any, Callable, Iterable,Dict, Union
import subprocess

#from .command_index import CommandIndex

applications = {
    "vivaldi": "",
    "opera": ""
}
class CommandType:

    def resolve_and_execute(self):
        pass

class App(CommandType):
    exec_index: Dict[str, str] = applications

    def __init__(self, name: str):
        self.name = name

class Key(CommandType):
    def __init__(self, name: str):
        self.name = name





tree = {
    "a": {
        'apps*'
    },
    "l": {
        "label": "launch application",
        "v": App("vivaldi"),
        "o": App("opera"),
        "i": App("idea"),
        "t": App("terminus")
    },
    "w": {
        "label": "windows",
        "prefix": ["win"],
        "s": Key("select"),
        "c": Key("close"),
        "m": Key("maximize"),
        "l": Key("left"),
        "r": Key("right"),
        "h": Key("hide"),
    }
}





def path(query: str) -> Any:
    pass


class Multimethod:

    def __init__(self):
        self.functions = {}

    def match(self, x: object):
        try:
            return self.functions[ type(x) ](x)
        except:
            return None

    def type_map(self, type):
        def wrap(fn: Callable[[type], Any]):
            self.functions[type] = fn
        return wrap

class BranchOrTerm(Multimethod):

    def __init__(self):
        super().__init__()


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

        self.config_dir = ""
        contents = {
            "applications": self.load_file('applications.yaml'),
            "keys": self.load_file("keybind.yaml")
        }

    def load_file(self, file):
		pass




class CommandTreeTraversal:

    def __init__(self):
        self.ids = IdDispensory()
        self.constants = ConstantLoader()


    def partition(self, seq: Iterable,
                  predicate: Callable[[Any],bool],
                  rtype="tuple"):
        yes, no = [], []
        for i in seq:
            (yes if predicate(i) else no).append(i)
        if rtype is not "tuple":
            return {True: yes,
                    False: no}
        else:
            return yes, no


    def traverse(self,
                 tree: Union[dict, CommandType],
                 symbol: str) -> Dict:

        metadata_fields = ['label', 'prefix']
        def is_command(node):
            return ('command' in node.__dict__().keys())

        if isinstance(tree, dict):
            result = {}
            metadata, subnodes = self.partition(tree.items(),
                                           lambda _: _[0] in metadata_fields)
            metadata.append(("symbol", symbol))
            result["data"] = {k: v for k, v in metadata}
            subtrees = []
            for sym, branch in subnodes:
                tree = self.traverse(branch, sym)
                subtrees.append(tree)
            result['subtree'] = subtrees
            return result

        else:
            result: dict = self.handle_command(tree)
            return result

    def handle_command(self, command: CommandType) -> Dict[str, Any]:
        id: int = self.ids.available()
        metadata = self.process_command(command)
        return {
            'data': metadata,
            'command': id
        }

    def process_command(self, command):

        instanceOf = lambda type: isinstance(command, type)

        if instanceOf(App):
            exe = self.constants['applications']
            subprocess.run(exe)

        if instanceOf(Key):
            pass

        return {"label": command.name}





def assign_commandID():
    pass


