

class RoutineContext:
    """
    Provides a means to encapsulate a set of functions
    along with their results.

    The methods of a RoutineContext are those required to
    perform a specific task

    Especially useful when the parameters required for a
    function are to be supplied from separate scopes
    """
    pass


class Multimethod:

    def __init__(self):
        self.functions = {}

    def match(self, x: object):
        try:
            return self.functions[ type(x) ](x)
        except:
            return None

    def type_map(self, typ):
        def wrap(fn: Callable[[typ], Any]):
            self.functions[typ] = fn
        return wrap