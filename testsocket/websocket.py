import asyncio
import websockets
import json
finished = False

async def pong_server(websocket, path):
    while True:
        message = await websocket.recv()
        print(message)
        jsonmessage = json.loads(message)
        print(jsonmessage['message'])
        if jsonmessage['message'] == 'stop':
            global finished
            finished = True
            break
        # Traiter le message reçu du client
        # Envoyer une réponse au client si nécessaire
        await websocket.send("pong")


async def main():
	global finished
	finished = False
	async with websockets.serve(pong_server, "localhost", 8765):
          while not finished:
              await asyncio.sleep(1)
    
asyncio.run(main())