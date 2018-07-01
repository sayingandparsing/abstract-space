import pykka
import asyncio
from asyncio import Future
import zmq
import abc



class RemoteMessageActor(pykka.ThreadingActor):

	def __init__(self, socket: zmq.Socket):
		super().__init__()
		self.socket = socket
		asyncio.get_event_loop() \
			   .run_until_complete(self.recieve())

	@abc.abstractmethod
	def setup_connection(self):
		pass

	async def receive(self):
		msg: Future = await self.socket.recv_json()
		msg.add_done_callback(lambda _: self.process(_))

	@abc.abstractmethod
	async def process(self, msg):
		pass
