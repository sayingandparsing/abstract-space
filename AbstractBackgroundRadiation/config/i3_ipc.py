import i3ipc
from i3ipc import Con
from typing import NamedTuple, List, Callable




class I3Messenger:

    class Container(NamedTuple):
        id: int
        name: str
        title: str
        focused: bool

        @staticmethod
        def extracted_from(con: Con) \
                    -> I3Messenger.Container:
            return I3Messenger.Container (
                con,
                con.window_class,
                con.name
            )


    class Context:
        def __init__(self):
            self.ws_start: int = None
            self.ws_working: int = None

    def __init__(self):
        self.current = ''
        self.sucesses = True
        self.connection: i3ipc.Connection = i3ipc.Connection()


    def select_window(self, id: int):
        return self

    def ctn_to_ws(self, ws: int) -> bool:
        res = msg('move to workspace number %i' % ws)
        self.success = is_success(res)
        return self

    def dual_tabs(self, win1, win2, win3):
        pass


    def current_workspace(self):
        ws = self.connection.get_tree()\
                            .find_focused()\
                            .workspace()

    def windows_in_container(self,
                             cnt: i3ipc.Con,
                             extractor: Callable):
        pass

    def switch_windows(self, win1, win2):
        pass


    def empty(self)
        pass

    def ctns_on_ws(self) -> List[Container]:

