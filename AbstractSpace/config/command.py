from .daemon import RemoteMessageActor
import asyncio

class CommandIndex(dict):
	def __init__(self):
		pass

class CommandDelegate(RemoteMessageActor):

	def __init__(self, register, channel):
		RemoteMessageActor.__init__(self, channel)
		self.register: CommandIndex = register


	async def receive(self):
		msg: Future = await self.socket.recv_string()
		msg.add_done_callback(lambda _: self.process(_))

	def process(self, msg):
		try:
			command = self.register[msg]
			cmd_type = command["type"]
			if cmd_type is "key":
				self.execute_key_macro(command["arg"])
			if cmd_type is "shell":
				self.execute_shell_command(command["arg"])
		except:
			pass


	def execute_key_macro(self, macro):
		pass

	def execute_shell_command(self, cmd):
		pass
