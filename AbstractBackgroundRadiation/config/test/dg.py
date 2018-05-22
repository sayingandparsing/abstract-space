from config.ipc import DatagramInterlocuter
import asyncio

port = 8891
port2 = 8891
loop = asyncio.get_event_loop()

def receive_proto(send, data, addr):
    print('I received message ' + data.decode())
    if data.decode() != 'yeah I am here':
        send(bytes('yeah I am here', 'utf-8'), addr=addr)

a = (DatagramInterlocuter()
        .responds_with(receive_proto))
a.connect(port)
print(type(a))
b = (DatagramInterlocuter()
        .responds_with(receive_proto))
stat = b.connect(port)

try:
    loop.run_forever()
except:
    loop.close()

asyncio.sleep(3)
print('printing stat')
print(stat)

baddr = (a.addr[0], port2)
a.send(bytes('are you out there?', "utf-8"), addr=baddr)

