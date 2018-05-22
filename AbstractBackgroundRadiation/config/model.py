from .messaging import RemoteMessageActor
from .tree import CommandTreeTraversal
import zmq

class ModelSupplier(RemoteMessageActor):

	def __init__(self, socket: zmq.Socket, tree):
		RemoteMessageActor.__init__(self, socket)
		self.tree = tree

	def process(self, msg):
		if msg['type'] is 'initial setup':
			self.socket.send_json({
				"type": "initial tree",
				"content": self.tree
			})
			self.tree = None


