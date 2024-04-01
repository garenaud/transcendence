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

channel_layer = channels.layers.get_channel_layer()

class ChatConsumer(WebsocketConsumer):
    lolmessage = "superlol"
    mdrmessage = "superlolmdr"
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

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
    

class AsyncGameConsumer(AsyncWebsocketConsumer):
    
    def getGame(self):
        return Games.objects.filter(id=1).count()

    def saveGame(self,game):
        game.save()

    async def connect(self):
        game = await sync_to_async(self.getGame)()
        if game == 0:
            self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
            self.room_group_name = f"game_{self.room_name}"
            game = await sync_to_async(Games)(room_group_name=self.room_group_name)
            await sync_to_async(game.save)()
            self.playernb = 1
        else:
            game = await sync_to_async(Games.objects.get)(id=1)
            self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
            self.room_group_name = game.room_group_name
            self.playernb = 2


        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        self.game_values = {
            'p1_id' : 1,
            'p2_id' : -1,
            'finished' : False,
            'scoreleft' : 0,
            'scoreright' : 0,
            'initial_angle' : 0.0,
            'ball_radius' : 0.5196152,
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
            'channel_name' : self.channel_name,
            'message' : ""
        }
        self.ball_velocity = introcs.Vector3(math.cos(0) * 0.25, 0, math.sin(0) * 0.25)
        await self.accept()
        if self.playernb == 1:
            threading.Thread(target=self.loop).start()

    def loop(self):
        while True:
            time.sleep(0.02)
            ball_radius = 0.5196152
            paddle_size_x = 0.20000000298023224
            paddle_size_z = 3.1
            max_angle_adjustment = math.pi / 6
            min_angle_adjustment = (math.pi * -1) / 6
            #verifier la collision avec le paddle gauche
            if (self.game_values['ball_position_x'] - ball_radius < self.game_values['paddleleft_position_x'] + paddle_size_x / 2 and
                self.game_values['ball_position_x'] + ball_radius > self.game_values['paddleleft_position_x'] - paddle_size_x / 2 and
                self.game_values['ball_position_z'] + ball_radius > self.game_values['paddleleft_position_z'] - paddle_size_z / 2 and
                self.game_values['ball_position_z'] - ball_radius < self.game_values['paddleleft_position_z'] + paddle_size_z / 2
                ):
                relative_position = (self.game_values['ball_position_z'] - self.game_values['paddleleft_position_z']) / paddle_size_z
                angleadjustment = (relative_position - 0.5) * (max_angle_adjustment - min_angle_adjustment) * 0.6
                # Ajuster la direction de la balle en fonction de l'angle
                angle = math.pi / 4 + angleadjustment
                self.ball_velocity.x = math.cos(angle) * (0.2 * self.game_values['speed_increase_factor'])
                self.ball_velocity.z = math.sin(angle) * (0.2 * self.game_values['speed_increase_factor'])
                self.game_values['speed_increase_factor'] += 0.1
                # print("collision detectee a gauche")
            #verifier la collision avec le paddle droit
            if (self.game_values['ball_position_x'] - ball_radius < self.game_values['paddleright_position_x'] + paddle_size_x / 2 and
                self.game_values['ball_position_x'] + ball_radius > self.game_values['paddleright_position_x'] - paddle_size_x / 2 and
                self.game_values['ball_position_z'] + ball_radius > self.game_values['paddleright_position_z'] - paddle_size_z / 2 and
                self.game_values['ball_position_z'] - ball_radius < self.game_values['paddleright_position_z'] + paddle_size_z / 2
                ):
                relative_position = (self.game_values['ball_position_z'] - self.game_values['paddleright_position_z']) / paddle_size_z
                angleadjustment = (relative_position - 0.5) * (max_angle_adjustment - min_angle_adjustment) * 0.3
                # Ajuster la direction de la balle en fonction de l'angle
                angle = (math.pi * -1) / 4 - angleadjustment
                self.ball_velocity.x = (math.cos(angle) * -1) * (0.2 * self.game_values['speed_increase_factor'])
                self.ball_velocity.z = (math.sin(angle) * -1) * (0.2 * self.game_values['speed_increase_factor'])
                self.game_values['speed_increase_factor'] += 0.1
                # print("collision detectee a droite")

            balllimit = 8.5
            if self.game_values['ball_position_z'] > balllimit or self.game_values['ball_position_z'] < -balllimit:
                self.ball_velocity.z *= -1
                # print("mur")
            elif self.game_values['ball_position_x'] > 18 or self.game_values['ball_position_x'] < -18:
                if self.game_values['ball_position_x'] > 18:
                    self.game_values['scoreleft'] += 1
                elif self.game_values['ball_position_x'] < -18:
                    self.game_values['scoreright'] += 1
                self.game_values['ball_position_x'] = 0.0
                self.game_values['ball_position_z'] = 0.0
                self.game_values['speed_increase_factor'] = 1.1
                self.ball_velocity = introcs.Vector3(math.cos(0) * 0.25, 0, math.sin(0) * 0.25)

            self.game_values['ball_velocity_x'] = self.ball_velocity.x
            self.game_values['ball_velocity_z'] = self.ball_velocity.z
            self.game_values['ball_position_x'] += self.game_values['ball_velocity_x']
            self.game_values['ball_position_z'] += self.game_values['ball_velocity_z']
            
            # async_to_sync(self.channel_layer.group_send)(
            #     self.room_group_name,
            #     {"type": "update", "message": {'action' : 'game', 'bx' : self.game_values['ball_position_x'], 'bz' : self.game_values['ball_position_z']}}
            # )

    async def disconnect(self, close_code):
        self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )
        self.game_values = {}

    async def receive(self, text_data):
        jsondata = json.loads(text_data)
        message = jsondata['message']
        if self.playernb == 1:
            if message == 'Up' and self.game_values['paddleright_position_z'] - self.game_values['move_speed'] > -6.5:
                self.game_values['paddleright_position_z'] -= self.game_values['move_speed']
            elif message == 'Down' and self.game_values['paddleright_position_z'] + self.game_values['move_speed'] < 6.5:
                self.game_values['paddleright_position_z'] += self.game_values['move_speed']
            elif message == 'update':
                await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "update", "message": {'action' : 'game', 'bx' : self.game_values['ball_position_x'], 'bz' : self.game_values['ball_position_z']}}
                )
        elif self.playernb == 2:
            if message == 'W' and self.game_values['paddleleft_position_z'] - self.game_values['move_speed'] > -6.5:
                self.game_values['paddleleft_position_z'] -= self.game_values['move_speed']
            elif message == 'S' and self.game_values['paddleleft_position_z'] + self.game_values['move_speed'] < 6.5:
                self.game_values['paddleleft_position_z'] += self.game_values['move_speed']
        if self.playernb == 1:
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "update", "message": {'action' : 'p1', 'px' : self.game_values['paddleright_position_x'] , 'pz' : self.game_values['paddleright_position_z'] }}
            )
        elif self.playernb == 2:
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "update", "message": {'action' : 'p2', 'px' : self.game_values['paddleleft_position_x'] ,'pz' : self.game_values['paddleleft_position_z'] }}
            )

    async def update(self, event):
        data = event['message']
        await self.send(text_data=json.dumps(data))

class GameConsumer(WebsocketConsumer):
    #     'p1_id' : 1,
    #     'p2_id' : -1,
    #     'finished' : False,
    #     'scoreleft' : 0,
    #     'scoreright' : 0,
    #     'initial_angle' : 0.0,
    #     'ball_radius' : 0.5196152629183178,
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
    #     'room_name' : "",
    #     'room_group_name' : ""
    # }

    ball_velocity = introcs.Vector3(math.cos(0) * 0.25, 0, math.sin(0) * 0.25)

    def handle_wall_collision(self):
        balllimit = 8.5
        if self.game_values['ball_position_z'] > balllimit or self.game_values['ball_position_z'] < -balllimit:
            self.ball_velocity.z *= -1
            # print("mur")
        elif self.game_values['ball_position_x'] > 18 or self.game_values['ball_position_x'] < -18:
            if self.game_values['ball_position_x'] > 18:
                self.game_values['scoreleft'] += 1
            elif self.game_values['ball_position_x'] < -18:
                self.game_values['scoreright'] += 1
            self.game_values['ball_position_x'] = 0.0
            self.game_values['ball_position_z'] = 0.0
            self.game_values['speed_increase_factor'] = 1.1
            ball_velocity = introcs.Vector3(math.cos(0) * 0.25, 0, math.sin(0) * 0.25)
    
    def handle_paddle_collision(self):
        ball_radius = self.game_values['ball_radius']
        paddle_size_x = 0.20000000298023224
        paddle_size_z = 3.1
        max_angle_adjustment = math.pi / 6
        min_angle_adjustment = (math.pi * -1) / 6
        #verifier la collision avec le paddle gauche
        if (self.game_values['ball_position_x'] - ball_radius < self.game_values['paddleleft_position_x'] + paddle_size_x / 2 and
            self.game_values['ball_position_x'] + ball_radius > self.game_values['paddleleft_position_x'] - paddle_size_x / 2 and
            self.game_values['ball_position_z'] + ball_radius > self.game_values['paddleleft_position_z'] - paddle_size_z / 2 and
            self.game_values['ball_position_z'] - ball_radius < self.game_values['paddleleft_position_z'] + paddle_size_z / 2
            ):
            relative_position = (self.game_values['ball_position_z'] - self.game_values['paddleleft_position_z']) / paddle_size_z
            angleadjustment = (relative_position - 0.5) * (max_angle_adjustment - min_angle_adjustment) * 0.6
            # Ajuster la direction de la balle en fonction de l'angle
            angle = math.pi / 4 + angleadjustment
            self.ball_velocity.x = math.cos(angle) * (0.2 * self.game_values['speed_increase_factor'])
            self.ball_velocity.z = math.sin(angle) * (0.2 * self.game_values['speed_increase_factor'])
            self.game_values['speed_increase_factor'] += 0.1
            # print("collision detectee a gauche")
        #verifier la collision avec le paddle droit
        if (self.game_values['ball_position_x'] - ball_radius < self.game_values['paddleright_position_x'] + paddle_size_x / 2 and
            self.game_values['ball_position_x'] + ball_radius > self.game_values['paddleright_position_x'] - paddle_size_x / 2 and
            self.game_values['ball_position_z'] + ball_radius > self.game_values['paddleright_position_z'] - paddle_size_z / 2 and
            self.game_values['ball_position_z'] - ball_radius < self.game_values['paddleright_position_z'] + paddle_size_z / 2
            ):
            relative_position = (self.game_values['ball_position_z'] - self.game_values['paddleright_position_z']) / paddle_size_z
            angleadjustment = (relative_position - 0.5) * (max_angle_adjustment - min_angle_adjustment) * 0.3
            # Ajuster la direction de la balle en fonction de l'angle
            angle = (math.pi * -1) / 4 - angleadjustment
            self.ball_velocity.x = (math.cos(angle) * -1) * (0.2 * self.game_values['speed_increase_factor'])
            self.ball_velocity.z = (math.sin(angle) * -1) * (0.2 * self.game_values['speed_increase_factor'])
            self.game_values['speed_increase_factor'] += 0.1
            # print("collision detectee a droite")

    def update_ball_pos(self):
        while self.game_values['finished'] == False:
            time.sleep(0.02)
            self.handle_paddle_collision()
            self.handle_wall_collision()
            self.game_values['ball_velocity_x'] = self.ball_velocity.x
            self.game_values['ball_velocity_z'] = self.ball_velocity.z
            self.game_values['ball_position_x'] += self.game_values['ball_velocity_x']
            self.game_values['ball_position_z'] += self.game_values['ball_velocity_z']
            # print(self.game_values['ball_position_x'])
            #self.send(text_data=json.dumps(self.game_values))
            # async_to_sync(self.channel_layer.group_send)(self.randname, {"type" : "testsend", "game_data" : self.game_values})
            async_to_sync(channel_layer.group_send)(
             self.room_group_name, {"type": "chat_message", "message": self.game_values}
            )

    def update_right_paddle_pos(self, message):
        if message == 'Up' and self.game_values['paddleright_position_z'] - self.game_values['move_speed'] > -6.5:
            self.game_values['paddleright_position_z'] -= self.game_values['move_speed']
        elif message == 'Down' and self.game_values['paddleright_position_z'] + self.game_values['move_speed'] < 6.5:
            self.game_values['paddleright_position_z'] += self.game_values['move_speed']

    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name
        self.game_values = {
            'p1_id' : 1,
            'p2_id' : -1,
            'finished' : False,
            'scoreleft' : 0,
            'scoreright' : 0,
            'initial_angle' : 0.0,
            'ball_radius' : 0.5196152629183178,
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
        self.game_values['room_name'] = self.room_name
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
        # game = Games(player1=User.objects.get(id=self.game_values['p1_id']), p1_score=self.game_values['scoreleft'], p2_score=self.game_values['scoreright'])
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
            self.game_values['paddleleft_position_z'] = float(pos)
        else:
            self.update_right_paddle_pos(message)
        # async_to_sync(channel_layer.group_send)(
        #      self.room_group_name, {"type": "chat_message", "message": self.game_values}
        #  )
    
    def chat_message(self, event):
        data = event["message"]
        self.send(text_data=json.dumps(data))

        
    # finished = False
    # scoreleft = 0
    # scoreright = 0
    # ball_position_x = 0.0
    # ball_position_z = 0.0
    # ball_velocity_x = 0.0
    # ball_velocity_z = 0.0
    # paddleleft_position_x = 0.0
    # paddleleft_position_z = 0.0
    # paddleright_position_x = 0.0
    # paddleright_position_z = 0.0
    # move_speed = 0.1
        