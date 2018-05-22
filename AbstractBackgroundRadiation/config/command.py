#from config.messaging import RemoteMessageActor
#import asyncio
#from asyncio import Future
#from asyncio.subprocess import Process
from subprocess import Popen
import shlex
#import subprocess
from time import sleep

class CommandIndex(dict):
    def __init__(self):
        super().__init__()
        pass


class CommandDelegate:

    def __init__(self, register, port):
        self.register = register

    async def handle(self, id):
        print('handling command')
        await self.process(id)

    async def receive(self):
        pass
        #msg: Future = await self.socket.recv_string()
        #msg.add_done_callback(lambda _: self.process(_))

    async def process(self, msg):
        try:
            command = self.register[msg]
            cmd_type = command["type"]
            if cmd_type == "key":
                print('key command')
                self.execute_key_macro(command["arg"])
            if cmd_type == "shell":
                print('shell command')
                command_arg = command["arg"]
                print(command_arg)
                self.execute_shell_command(command_arg)
        except Exception as e:
            print(e)
            print('command delegate failed on lookup')

    def execute_key_macro(self, macro):
        print('key given: '+ macro)
        sleep(0.1)
        self.execute_shell_command(
            'xdotool key %s' % macro
        )

    def execute_shell_command(self, cmd):
        parsed_cmd = shlex.split(cmd)
        p = Popen(parsed_cmd)
        print(p)

    def get_process_information(self):
        pass
