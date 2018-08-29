#!/usr/bin/python3 -u

# Note that running python with the `-u` flag is required on Windows,
# in order to ensure that stdin and stdout are opened in binary, rather
# than text, mode.

import json
import sys
import struct

class DatagramInterlocuter:

    class DataProto(DatagramProtocol):

        def __init__(self, interp_dg):
            DatagramProtocol.__init__(self)
            self.interp_dg = interp_dg

        def datagram_received(self, data, addr):
            print('recieved')
            self.interp_dg(data, addr)


    def __init__(self):
        self.transport: DatagramTransport = None
        self.protocol = None
        self.loop = asyncio.get_event_loop()
        self.addr: (str, int) = None
        self.process_fn = None
        #atexit.register(lambda: self.transport.close())
        print('setting up datagram transport')


    def connect(self, port):
        asyncio.ensure_future(self.connect_to(port))
        return self

    async def connect_to(self,
                port: int,
                host='127.0.0.1'):
        print('connecting datagram transport')
        self.addr = (host, port)
        if self.process_fn is None:
            raise Exception('Must use the `handles` method to provide a function for reacting to incoming messages')
        proto = partial(self.DataProto, self.process_fn)
        conn = self.loop.create_datagram_endpoint(
                    lambda: proto(),
                    local_addr=(host, port)
        )
        # print(listen)
        # self.transport, _ = \
        self.transport, self.protocol = await conn
        print(self.transport)
        print('connected')
        return True

    def send(self, data, addr=None):
        print('sending')
        self.transport.sendto(data,
                              addr=self.addr if addr is None
                                    else addr)


    def responds_with(self, receive_fn):
        self.process_fn = partial(receive_fn, self.send)
        return self



# Read a message from stdin and decode it.
async def get_message():
    raw_length = sys.stdin.buffer.read(4)
    if not raw_length:
        sys.exit(0)
    message_length = struct.unpack('i', raw_length)[0]
    message = sys.stdin.buffer.read(message_length)
    return json.loads(message)


# Encode a message for transmission, given its content.
async def encode_message(message_content):
    encoded_content :bytes =\
            json.dumps(message_content).encode('utf-8')
    encoded_length = struct.pack('i', len(encoded_content))
    return {'length': encoded_length, 'content': encoded_content}


# Send an encoded message to stdout.
async def send_message(encoded_message):
    sys.stdout.buffer.write(encoded_message['length'])
    sys.stdout.buffer.write(encoded_message['content'])
    sys.stdout.buffer.flush()


while True:
    message = get_message()
    if message == "ping":
        send_message(await encode_message("pong"))
