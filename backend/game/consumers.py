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

gameTab = [None] * 10000

channel_layer = channels.layers.get_channel_layer()

class AsyncGameConsumer(AsyncWebsocketConsumer):
    
    def getGame(self):
        return Games.objects.filter(id=1).count()

    def saveGame(self,game):
        game.save()

    async def connect(self):
        self.task = None
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = f"game_{self.room_id}"
        if gameTab[self.room_id] is None:
            gameTab[self.room_id] = gameData(self.room_id)
            self.game = gameTab[self.room_id]
            self.game.p1id = self.channel_name
            self.game.dbgame = Games(p1_id=1, p2_id=2, room_id=self.room_id, room_group_name=self.room_group_name)
            await sync_to_async(self.saveGame)(self.game.dbgame)
            print("p1")
        else:
            self.game = gameTab[self.room_id]
            self.game.p2id = self.channel_name
            self.game.dbgame.full = True
            await sync_to_async(self.saveGame)(self.game.dbgame)
            print("p2")
        
            
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type' : 'update',
                "message": {'action' : 'private'}
            }
        )

        

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

    async def stop_game(self):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type' : 'update',
                "message": {'action' : 'Stop', 'scorep1' : self.game.scorep1, 'scorep2' : self.game.scorep2}
            }
        )

    async def send_counter(self):
        for num in range(6, 0, -1):
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "update", "message": {'action': 'counter', 'num': num}}
            )
            await asyncio.sleep(1.5)


    async def loop(self):
        def check_collision(self, paddle_x, paddle_z):
            paddle_size_x = 0.1
            paddle_size_z = 3.1
            if (
                self.game.bpx - self.game.bradius < paddle_x + paddle_size_x / 2 and
                self.game.bpx + self.game.bradius > paddle_x - paddle_size_x / 2 and
                self.game.bpz + self.game.bradius > paddle_z - paddle_size_z / 2 and
                self.game.bpz - self.game.bradius < paddle_z + paddle_size_z / 2 and
                self.game.bpx < 15):
                self.game.bv.x *= -1
                self.game.sif += 0.1

        while self.game.finished == False:
            await asyncio.sleep(4)
            await self.send_counter()
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "update", "message": {'action' : 'start'}}
            )
            if self.game.scorep1 == 5 or self.game.scorep2 == 5:
                self.game.finished = True
                self.game.dbgame.finished = True
                await sync_to_async(self.saveGame)(self.game.dbgame)
                await self.stop_game()

            # Check collision with left and right paddles
            check_collision(self, self.game.plx, self.game.plz)  # Left paddle
            check_collision(self, self.game.prx, self.game.prz)  # Right paddle
            print(self.game.bv.z)
            print(self.game.bv.x)
            balllimit = 8.5
            if self.game.bpz > balllimit or self.game.bpz < -balllimit:
                self.game.bv.z *= -1
            elif self.game.bpx > 15 or self.game.bpx < -15:
                if self.game.bpx > 15:
                    self.game.scorep2 += 1
                elif self.game.bpx < -15:
                    self.game.scorep1 += 1
                self.game.bpx = 0.0
                self.game.bpz = 0.0
                self.game.sif = 0.4
            self.game.bvx = self.game.bv.x
            self.game.bvz = self.game.bv.z
            self.game.bpx += self.game.bvx * self.game.sif
            self.game.bpz += self.game.bvz * self.game.sif
            await self.ball_update({'bpx' : self.game.bpx, 'bpz' : self.game.bpz})
            await asyncio.sleep(1 / 120)
            
    async def disconnect(self, close_code):
        self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )
        try:
            self.task.cancel()
        except:
            print('ca arrive hein')
        self.game.finished = True
        self.game.dbgame.finished = True
        await sync_to_async(self.saveGame)(self.game.dbgame)

    async def receive(self, text_data):
        jsondata = json.loads(text_data)
        message = jsondata['message']
        if message == 'private' or message == 'public':
            if message == 'private':
                self.game.dbgame.private = True
                await sync_to_async(self.saveGame)(self.game.dbgame)
            if self.game.dbgame.full == True:
                self.game.started = True 
                self.task = asyncio.create_task(self.loop())
        if message == 'ball_update':
            await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "update", "message": {'action' : 'game', 'bx' : self.game.bpx, 'bz' : self.game.bpz, 'plx' : self.game.plx ,'plz' : self.game.plz, 'prx' : self.game.prx ,'prz' : self.game.prz}}
            )
        elif message == "Stop" or self.game.finished == True:
            try:
                self.task.cancel()
            except:
                pass
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
    lolmessage = "superlol"
    mdrmessage = "superlolmdr"
    def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = "chat_%s" % self.room_id

        # Join room group
        async_to_sync(channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()


    def test1(self):
        self.lolmessage = "test1"

    def test2(self):
        self.lolmessage = "test2"

    def test3(self):
        self.mdrmessage = "test3"

    def loop(self):
        while True:
            time.sleep(1)
            self.test1()
            self.test2()
            self.test3()
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

        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message}))
    
class GameConsumer(WebsocketConsumer):
    #     'p1_id' : 1,
    #     'p2_id' : -1,
    #     'finished' : False,
    #     'scoreleft' : 0,
    #     'scoreright' : 0,
    #     'initial_angle' : 0.0,
    #     'self.game.bradius' : 0.5196152629183178,
    #     'ball_position_x' : 0.0,
    #     'ball_position_z' : 0.0,
    #     'ball_velocity_x' : 0.0,
    #     'ball_velocity_z' : 0.0,
    #     'paddleleft_position_x' : -15.0,
    #     'paddleleft_position_z' : 0.0,
    #     'paddleright_position_x' : 15.0,
    #     'paddleright_position_z' : 0.0,
    #     'move_speed' : 0.25,
    #     'speed_increase_factor' : 1.1,
    #     'room_id' : "",
    #     'room_group_name' : ""
    # }

    def update_right_paddle_pos(self, message):
        if message == 'Up' and self.game.prz - self.game.ms > -6.5:
            self.game.prz -= self.game.ms
        elif message == 'Down' and self.game.prz + self.game.ms < 6.5:
            self.game.prz += self.game.ms

    def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = "chat_%s" % self.room_id
        self.game_values = {
            'p1_id' : 1,
            'p2_id' : -1,
            'finished' : False,
            'scoreleft' : 0,
            'scoreright' : 0,
            'initial_angle' : 0.0,
            'self.game.bradius' : 0.5196152629183178,
            'ball_position_x' : 0.0,
            'ball_position_z' : 0.0,
            'ball_velocity_x' : 0.0,
            'ball_velocity_z' : 0.0,
            'paddleleft_position_x' : -15.0,
            'paddleleft_position_z' : 0.0,
            'paddleright_position_x' : 15.0,
            'paddleright_position_z' : 0.0,
            'move_speed' : 0.25,
            'speed_increase_factor' : 1.1,
            'channel_name' : self.channel_name
        }
        self.game_values['room_id'] = self.room_id
        self.game_values['room_group_name'] = self.room_group_name
        # Join room group
        async_to_sync(channel_layer.group_add)(
        self.room_group_name, self.channel_name
        )
        self.accept()
        threading.Thread(target=self.update_ball_pos).start()


    def disconnect(self, close_code):
        async_to_sync(channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
        # game = Games(player1=User.objects.get(id=self.game_values['p1_id']), p1_score=self.game.scorep2, p2_score=self.game.scorep1)
        # game.save()
        #async_to_sync(self.channel_layer.group_add)(self.randname), self.channel_name)
        pass

    def receive(self, text_data):
        #while self.game_values['finished'] == False:
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        #print(message)
        if message == 'Stop':
            self.game_values['finished'] = True
        elif message == 'IA':
            pos = text_data_json['pos']
            self.game.plz = float(pos)
        else:
            self.update_right_paddle_pos(message)
        # async_to_sync(channel_layer.group_send)(
        #      self.room_group_name, {"type": "chat_message", "message": self.game_values}
        #  )
    
    def chat_message(self, event):
        data = event["message"]
        self.send(text_data=json.dumps(data))