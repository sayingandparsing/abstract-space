
from aio_pika import connect, Message, Channel, Queue
from functools import partial
import asyncio
from asyncio import (
    AbstractEventLoop,
    Future,
    DatagramProtocol,
    DatagramTransport
)
from typing import Callable,Awaitable, Dict
from asyncio import Future
import uuid
import pika
import socket
from functools import partial
import aioamqp
import json
import atexit


def scheduler(loop: AbstractEventLoop):
    def future(coro):
        f = asyncio.ensure_future(coro)
        loop.run_until_complete(f)
        return f
    return future

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


class RpcClient(object):
    def __init__(self):
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))

        self.channel = self.connection.channel()

        result = self.channel.queue_declare(exclusive=True)
        self.callback_queue = result.method.queue

        self.channel.basic_consume(self.on_response, no_ack=True,
                                   queue=self.callback_queue)
        print('client initialized')

    def on_response(self, ch, method, props, body):
        print('client received response: ' + body)
        if self.corr_id == props.correlation_id:
            self.response = body

    def call(self, n):
        self.response = None
        self.corr_id = str(uuid.uuid4())
        print('client publishing')
        self.channel.basic_publish(exchange='',
                                   routing_key='display',
                                   properties=pika.BasicProperties(
                                       reply_to = self.callback_queue,
                                       correlation_id = self.corr_id,

                                         ),
                                   body=n)
        print('client published')
        while self.response is None:
            self.connection.process_data_events()
        return self.response

class RpcClientAsync(object):

    def __init__(self, name, connection=None, loop=None):
        print('creating rpc client ' + name)
        self.loop = (loop if loop is not None
                     else asyncio.get_event_loop())
        # self.connection = (connection if connection is not None
        #                    else connect("amqp://guest:guest@localhost/",
        #                                 loop=loop))
        self.connection = None
        self.channel: Channel = None
        #f = asyncio.ensure_future(self.setup(), loop=self.loop)
        asyncio.ensure_future(self.setup())
        #asyncio.run_coroutine_threadsafe(self.get_channel(), self.loop)

        self.name = name
        self.queue = None
        self.data_hooks: Dict[str, Callable] = {}


    async def setup(self):
        self.connection = await connect("amqp://guest:guest@127.0.0.1/",
                                        loop=self.loop)
        print('rabbit connected')
        self.channel = await self.connection.channel()



    async def request(self,
                      msg: str,
                      process_response: Callable = None,
                      name: str = None):
        print('requesting')
        print('chann')
        print(type(self.channel))
        if self.channel is None:
            print('is none')
            self.channel = await self.connection.channel()
        name = name if name is not None else self.name
        temp_queue = await self.channel.declare_queue()#exclusive=True)
        exchange = await self.channel.declare_exchange(name, auto_delete=True)
        queue = await self.channel.declare_queue(name, auto_delete=True)
        await queue.bind(exchange, name)

        def respond_and_close(fn, temp: Queue):
            def inner(msg):
                print('recieve callback')
                fn(msg)
                temp.delete()
            return inner
        # callback = partial(respond_and_close,
        #                    process_response,
        #                    temp_queue)
        def a():
            print('RESPONSE')
        callback = respond_and_close(process_response, temp_queue)
        print(type(callback))
        #print(type(callback))
        #future_response: Future = asyncio.ensure_future(
        temp_queue.consume(callback, no_ack=True)
        #self.loop.run_until_complete(future_response)

        await self.channel.default_exchange.publish(
            Message(bytes(msg, 'utf-8'),
                    reply_to=temp_queue.name),
            routing_key=name)
        print('published')



    def on(self, typ: str, fn: Callable):
        self.data_hooks[typ] = fn
        return self


class RpcClientAsyncB:

    def __init__(self, name, reply_callback):
        self.transport = None
        self.protocol = None
        self.channel = None
        self.callback_queue = None
        self.waiter = asyncio.Event()
        self.name = name
        self.reply_callback = reply_callback

    @asyncio.coroutine
    def connect(self):
        """ an `__init__` method can't be a coroutine"""
        self.transport, self.protocol = yield from aioamqp.connect()
        self.channel = yield from self.protocol.channel()

        result = yield from self.channel.queue_declare(queue_name='daemon')
        yield from self.channel.basic_qos(prefetch_count=1, prefetch_size=0, connection_global=False)
        self.callback_queue = result['queue']

        yield from self.channel.basic_consume(
            self.on_response,
            no_ack=True,
            queue_name=self.callback_queue,
        )


    @asyncio.coroutine
    def on_response(self, channel, body, envelope, properties):
        print('received response from display')
        print(body)
        msg = json.loads(body)
        self.reply_callback(msg)
        #if self.corr_id == properties.correlation_id:
        #    self.response = body



    @asyncio.coroutine
    def request(self, n):
        print('sending request')
        if not self.protocol:
            yield from self.connect()
        self.response = None
        self.corr_id = str(uuid.uuid4())
        yield from self.channel.basic_publish(
            payload=str(n),
            exchange_name='',
            routing_key=self.name,
            properties={
                'reply_to': self.callback_queue,
                'correlation_id': self.corr_id,
            },
        )
        #yield from self.waiter.wait()
        #yield from self.protocol.close()
        return self.response
