from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
import json
import math
import introcs
import asyncio
import time
import threading
from database.models import Games
from django.contrib.auth.models import User
import channels.layers
from asgiref.sync import async_to_sync, sync_to_async
import random
from channels.db import database_sync_to_async
from.game_class import gameData

tasks = set()
gameTab = [None] * 1000

channel_layer = channels.layers.get_channel_layer()

class AsyncGameConsumer(AsyncWebsocketConsumer):
    
    def getGame(self):
        return Games.objects.filter(id=1).count()

    def saveGame(self,game):
        game.save()

    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = f"game_{self.room_id}"
        if gameTab[self.room_id] is None:
            gameTab[self.room_id] = gameData(self.room_id)
            self.game = gameTab[self.room_id]
            self.game.p1id = self.channel_name
        else:
            self.game = gameTab[self.room_id]
            self.game.p2id = self.channel_name
        
            
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        

    def ball_calc(self):
        pass

    def paddle_calc(self):
        pass

    async def ball_update(self, event):
        ball_position_x = event['bpx']
        ball_position_z = event['bpz']
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type' : 'update',
                "message": {'action' : 'ball', 'bx' : ball_position_x, 'bz' : ball_position_z}
            }
        )

    
    async def loop(self):
        while self.game.finished == False:
            print(self.game.sif)
            is_colliding = False
            #verifier la collision avec le paddle gauche
        for paddle in [(self.game.plx, self.game.plz), (self.game.prx, self.game.prz)]:
            if self.check_collision(paddle):
                self.game.bv.x *= -1
                self.game.sif += 0.1
                is_colliding = True
                break
            # print("collision detectee a droite"
        balllimit = 8.5
        if self.game.bpz > balllimit or self.game.bpz < -balllimit:
            self.game.bv.z *= -1
        elif self.game.bpx > 18 or self.game.bpx < -18:
            if self.game.bpx > 18:
                self.game.scorep2 += 1
            elif self.game.bpx < -18:
                self.game.scorep1 += 1
            self.game.bpx = 0.0
            self.game.bpz = 0.0
            self.game.sif = 0.8
        if (self.game.scorep2 == 5):
            self.game.finished = True
            self.game.bpx = 0.0
            self.game.bpz = 0.0
        elif (self.game.scorep1 == 5):
            self.game.finished = True
            self.game.bpx = 0.0
            self.game.bpz = 0.0
        self.game.bvx = self.game.bv.x
        self.game.bvz = self.game.bv.z
        self.game.bpx += self.game.bvx
        self.game.bpz += self.game.bvz
        
        await self.ball_update({'bpx' : self.game.bpx, 'bpz' : self.game.bpz})
        await asyncio.sleep(1 / 80)

PADDLE_SIZE_X = 0.2
PADDLE_SIZE_Z = 3.1

def check_collision(self, paddle):
    paddle_x, paddle_z = paddle
    return (self.game.bpx - self.game.bradius < paddle_x + PADDLE_SIZE_X / 2 and
           self.game.bpx + self.game.bradius > paddle_x - PADDLE_SIZE_X / 2 and
            self.game.bpz + self.game.bradius > paddle_z - PADDLE_SIZE_Z / 2 and
           self.game.bpz - self.game.bradius < paddle_z + PADDLE_SIZE_Z / 2)

async def disconnect(self, close_code):
    self.channel_layer.group_discard(
        self.room_group_name, self.channel_name
    )

    async def receive(self, text_data):
        jsondata = json.loads(text_data)
        message = jsondata['message']
        #print(f"message is {message}")
        if message == 'ball_update':
            await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "update", "message": {'action' : 'game', 'bx' : self.game.bpx, 'bz' : self.game.bpz, 'plx' : self.game.plx ,'plz' : self.game.plz, 'prx' : self.game.prx ,'prz' : self.game.prz}}
            )
        if message == "start" and self.game.started == False:
            self.game.started = True
            asyncio.create_task(self.loop())
        elif message == 'update':
            await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "update", "message": {'action' : 'game', 'bx' : self.game.bpx, 'bz' : self.game.bpz, 'plx' : self.game.plx ,'plz' : self.game.plz, 'prx' : self.game.prx ,'prz' : self.game.prz}}
            )
        elif self.game.p1id == self.channel_name:
            if message == 'Up' and self.game.prz - self.game.ms > -6.5:
                self.game.prz -= self.game.ms
            elif message == 'Down' and self.game.prz + self.game.ms < 6.5:
                self.game.prz += self.game.ms
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "update", "message": {'action' : 'paddle1', 'prx' : self.game.prx ,'prz' : self.game.prz }}
            )
        elif self.game.p2id == self.channel_name:
            if message == 'W' and self.game.plz - self.game.ms > -6.5:
                self.game.plz -= self.game.ms
            elif message == 'S' and self.game.plz + self.game.ms < 6.5:
                self.game.plz += self.game.ms
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "update", "message": {'action' : 'paddle2', 'plx' : self.game.plx ,'plz' : self.game.plz}}
            )
            

    async def update(self, event):
        data = event['message']
        await self.send(text_data=json.dumps(data))

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = "chat_%s" % self.room_id

        # Join room group
        async_to_sync(channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def loop(self):
        while True:
            time.sleep(1)
            async_to_sync(channel_layer.group_send)(
                self.room_group_name, {"type": "chat_message", "message": self.lolmessage}
            )

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Send message to room group
        async_to_sync(channel_layer.group_send)(
            self.room_group_name, {"type": "chat_message", "message": self.mdrmessage}
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event["message"]

        self.send(text_data=json.dumps({"message": message}))
    
class GameConsumer(WebsocketConsumer):

    def disconnect(self, close_code):
        async_to_sync(channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        if message == 'Stop':
            self.game_values['finished'] = True
        elif message == 'IA':
            pos = text_data_json['pos']
            self.game.plz = float(pos)
        else:
            self.update_right_paddle_pos(message)
    
    def chat_message(self, event):
        data = event["message"]
        self.send(text_data=json.dumps(data))