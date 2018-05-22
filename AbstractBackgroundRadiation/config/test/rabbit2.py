from config.ipc import RpcClientAsync
import asyncio

client = RpcClientAsync('test')
client2 = RpcClientAsync('test')

loop = asyncio.get_event_loop()
print(type(client.request))
f = asyncio.ensure_future(client.request('nothing'))
loop.run_until_complete(f)
loop.run_forever()