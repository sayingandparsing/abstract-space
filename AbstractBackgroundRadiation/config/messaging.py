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
               .run_until_complete(self.receive_msg())

    @abc.abstractmethod
    def setup_channel(self, port):
        channel = zmq.Context()
        socket = channel.socket('req')
        socket.bind("tcp://localhost:%s" % port)

    async def receive_msg(self):
        msg: Future = await self.socket.recv_json()
        msg.add_done_callback(lambda _: self.process(_))

    @abc.abstractmethod
    async def process(self, msg):
        pass
