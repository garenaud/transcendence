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
from asgiref.sync import async_to_sync
import random


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "chat_message", "message": message}
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message}))
    

        
class GameConsumer(WebsocketConsumer):

    game_values = {
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
        'speed_increase_factor' : 1.1
    }

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
        #     async_to_sync(self.channel_layer.group_send)(
        #     self.room_group_name, {"type": "chat_message", "message": self.game_values}
        # )

    def update_right_paddle_pos(self, message):
        if message == 'Up' and self.game_values['paddleright_position_z'] - self.game_values['move_speed'] > -6.5:
            self.game_values['paddleright_position_z'] -= self.game_values['move_speed']
        elif message == 'Down' and self.game_values['paddleright_position_z'] + self.game_values['move_speed'] < 6.5:
            self.game_values['paddleright_position_z'] += self.game_values['move_speed']

    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
        self.room_group_name, self.channel_name
        )
        threading.Thread(target=self.update_ball_pos).start()
        self.accept()


    def disconnect(self, close_code):
        game = Games(player1=User.objects.get(id=self.game_values['p1_id']), p1_score=self.game_values['scoreleft'], p2_score=self.game_values['scoreright'])
        game.save()
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
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
        self.update_right_paddle_pos(message)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "chat_message", "message": self.game_values}
        )
    
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
        