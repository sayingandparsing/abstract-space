import zmq

class Daemon:

	ports = {
		'command': 5500,
		'config': 5501
	}

	channels = ['tree_data', 'commands']

	def setup(self):
		self.setup_channels()
		self.run_electron()


	def setup_channels(self):
		channels = {}
		for name, port in self.ports.items():
			channel = zmq.Context()
			socket = channel.socket()
			socket.bind ("tcp://localhost:%s" % port)
			channels[name] = socket


	def run_electron(self):
		pass






