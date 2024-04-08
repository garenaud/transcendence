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
gameTab = [None] * 100

channel_layer = channels.layers.get_channel_layer()

class AsyncGameConsumer(AsyncWebsocketConsumer):
    
    def getGame(self):
        return Games.objects.filter(id=1).count()

    def saveGame(self,game):
        game.save()

    async def connect(self):
        self.room_id = 1 #self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = f"game_{self.room_id}"
        if gameTab[self.room_id] is None:
            gameTab[self.room_id] = gameData(self.room_id)
            self.game = gameTab[self.room_id]
            self.game.p1id = self.channel_name
            print("p1")
        else:
            self.game = gameTab[self.room_id]
            self.game.p2id = self.channel_name
            print("p2")
        
            
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        if self.game.p1id == self.channel_name:
            threading.Thread(target=self.loop).start()


    def loop(self):
        while True:
            time.sleep(0.02)
            is_colliding = False
            paddle_size_x = 0
            paddle_size_z = 3.2
            if not is_colliding:
                bx = self.game.bpx
                br = self.game.bradius
                px = self.game.prx
                pz = self.game.prz
            if (bx - br < px + paddle_size_x / 2 and
                bx + br > px - paddle_size_x / 2 and
                self.game.bpz + br > pz - paddle_size_z / 2 and
                self.game.bpz - br < pz + paddle_size_z / 2):
                self.game.bv.x *= -1
                self.game.sif += 0.1
                is_colliding = True
            #verifier la collision avec le paddle droit
            if (self.game.bpx - self.game.bradius < self.game.prx + paddle_size_x / 2 and
                self.game.bpx + self.game.bradius > self.game.prx - paddle_size_x / 2 and
                self.game.bpz + self.game.bradius > self.game.prz - paddle_size_z / 2 and
                self.game.bpz - self.game.bradius < self.game.prz + paddle_size_z / 2):
                self.game.bv.x *= -1;
                self.game.sif += 0.1
                is_colliding = True
                # print("collision detectee a droite"
            is_colliding = False
            balllimit = 8.5
            if self.game.bpz > balllimit or self.game.bpz < -balllimit:
                self.game.bv.z *= -1
                # print("mur")
            elif self.game.bpx > 18 or self.game.bpx < -18:
                if self.game.bpx > 18:
                    self.game.scorep2 += 1
                elif self.game.bpx < -18:
                    self.game.scorep1 += 1
                self.game.bpx = 0.0
                self.game.bpz = 0.0
                self.game.sif = 1.1

            self.game.bvx = self.game.bv.x
            self.game.bvz = self.game.bv.z
            self.game.bpx += self.game.bvx
            self.game.bpz += self.game.bvz
            
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {"type": "update", "message": {'action' : 'game', 'bx' : self.game.bpx, 'bz' : self.game.bpz, 'plx' : self.game.plx ,'plz' : self.game.plz, 'prx' : self.game.prx ,'prz' : self.game.prz}}
            )

    async def disconnect(self, close_code):
        self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

    async def receive(self, text_data):
        jsondata = json.loads(text_data)
        message = jsondata['message']
        if message == 'update':
            await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "update", "message": {'action' : 'game', 'bx' : self.game.bpx, 'bz' : self.game.bpz, 'plx' : self.game.plx ,'plz' : self.game.plz, 'prx' : self.game.prx ,'prz' : self.game.prz}}
            )
            return
        elif self.game.p1id == self.channel_name:
            if message == 'Up' and self.game.prz - self.game.ms > -6.5:
                self.game.prz -= self.game.ms
            elif message == 'Down' and self.game.prz + self.game.ms < 6.5:
                self.game.prz += self.game.ms
            # print("p1 paddle")
        elif self.game.p2id == self.channel_name:
            if message == 'W' and self.game.plz - self.game.ms > -6.5:
                self.game.plz -= self.game.ms
            elif message == 'S' and self.game.plz + self.game.ms < 6.5:
                self.game.plz += self.game.ms            

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