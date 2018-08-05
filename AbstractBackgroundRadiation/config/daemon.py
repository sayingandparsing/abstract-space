import zmq
from AbstractBackgroundRadiation.config.command import CommandDelegate
from AbstractBackgroundRadiation.config.tree import CommandTreeTraversal
from AbstractBackgroundRadiation.config.ipc import RpcClientAsyncB, DatagramInterlocuter
import asyncio
import subprocess
import atexit
import time
import json
from typing import Any


class Daemon:

    def __init__(self):

        self.input_server: DatagramInterlocuter = None
        self.command: CommandDelegate = None

        self.loop = asyncio.get_event_loop()


        task = asyncio.ensure_future(self.setup())
        self.loop.run_forever()

        self.state = 'inactive'

        self.display_client = None




    async def setup(self):
        self.display_client = RpcClientAsyncB('display', self.handle_response_from_display)
        self.run_electron()
        print('ran electron')
        print('creating tree')
        tree = CommandTreeTraversal()
        msg = {
            'type': 'tree',
            'content': tree.tree
        }

        s = json.dumps(msg)
        #while self.display_client.channel is None:
        #    asyncio.sleep(1)
        time.sleep(4)
        print('making request')
        await self.display_client.request(
            s
        )
        print('init tree sent')
        time.sleep(4)
        self.command = CommandDelegate(tree.command_index, None)
        asyncio.ensure_future(self.await_user_command(6601))


    async def await_user_command(self, port):
        print('opening user server')
        def foreward_msg(send, data, addr):
            msg = data.decode()
            print('received message to foreward')
            print(msg)
            if msg == 'QUIT':
                raise Exception
            else:
                print(msg)
                asyncio.ensure_future(self.display_request('display', msg, 'tree'))

        self.input_server = (DatagramInterlocuter()
                    .responds_with(foreward_msg))
        print('about to connect')
        self.input_server.connect(port)
        print('should have connected...')


    async def display_request(self,
                              msg_type: str,
                              content: Any,
                              subtype: str=None):
        print('display request from user')
        result = None
        print('msg_type')
        print(msg_type)
        try:
            request = await self.format_request(
                    msg_type,
                    content,
                    subtype)
            print('formatted request:')
            print(request)
            msg = await self.display_client.request(request)
            print('msg from display client request:')
            print(msg)
            result = json.loads(result)
            if not msg['type'] == 'failure':
                self.command.handle(msg)
        except Exception as e:
            print(e)

        return result


    async def format_request(self,
                              msg_type: str,
                              content: Any,
                              subtype: str=None,
                              tobinary_fn=None):

        msg = {
            'type': msg_type,
            'subtype': subtype,
            'content': content
        }
        return json.dumps(msg)



    async def await_tree_request(self, socket: zmq.Socket):
        return await socket.recv_string()

    def run_electron(self):
        #p = await asyncio.create_subprocess_shell(
        p = subprocess.Popen(
            ['electron', '/home/reagan/code/proj/abstract-space/AbstractSpace/index.js'])
           # stdout=asyncio.subprocess.PIPE
        #)

    def handle_response_from_display(self, msg):
        try:
            if msg['type'] == 'failure':
                self.state = 'inactive'
            else:
                command = int(msg['content'])
                asyncio.ensure_future(
                    self.command.handle(command)
                )
        except Exception as e:
            print('failed to parse response from display')
            print(e)


if __name__ == "__main__":
    d = Daemon()
