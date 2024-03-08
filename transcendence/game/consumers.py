from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
import json
import math
import introcs
import asyncio
import time
import threading

class ChatConsumer(WebsocketConsumer):
    game_values = {
        'finished' : False,
        'scoreleft' : 0,
        'scoreright' : 0,
        'ball_position_x' : 0.0,
        'ball_position_z' : 0.0,
        'ball_velocity_x' : 0.0,
        'ball_velocity_z' : 0.0,
        'paddleleft_position_x' : 0.0,
        'paddleleft_position_z' : 0.0,
        'paddleright_position_x' : 0.0,
        'paddleright_position_z' : 0.0,
        'move_speed' : 0.1
    }
    def printlol(self):
        while True:
            print("lol")
            time.sleep(1)

    def connect(self):
        self.accept()
        threading.Thread(target=self.printlol).start()


    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        if message == 'Up arrow pressed':
            self.game_values['ball_velocity_z'] += 1
        elif message == 'Down arrow pressed':
            self.game_values['ball_velocity_z'] -= 1
        self.send(text_data=json.dumps(self.game_values))
    

        
class GameConsumer(WebsocketConsumer):
    
    game_values = {
        'finished' : False,
        'scoreleft' : 0,
        'scoreright' : 0,
        'initial_angle' : 0.0,
        'ball_position_x' : 0.0,
        'ball_position_z' : 0.0,
        'ball_velocity_x' : 0.0,
        'ball_velocity_z' : 0.0,
        'paddleleft_position_x' : 0.0,
        'paddleleft_position_z' : 0.0,
        'paddleright_position_x' : 0.0,
        'paddleright_position_z' : 0.0,
        'move_speed' : 0.1
    }

    ball_velocity = introcs.Vector3(math.cos(0) * 0.1, 0, math.sin(0) * 0.1)

    def handle_wall_collision(self):
        pass
    
    def handle_paddle_collision(self):
        pass

    def update_ball_pos(self):
        print("enter update ball pos")
        while self.game_values['finished'] == False:
            time.sleep(0.05)
            self.game_values['ball_velocity_x'] = self.ball_velocity.x
            self.game_values['ball_velocity_z'] = self.ball_velocity.z
            self.game_values['ball_position_x'] += self.game_values['ball_velocity_x']
            self.game_values['ball_position_z'] += self.game_values['ball_velocity_z']
            self.handle_paddle_collision()
            self.handle_wall_collision()
            self.send(text_data=json.dumps(self.game_values))

    def update_right_paddle_pos(self, message):
        if message == 'Up':
            self.game_values['paddleright_position_z'] -= self.game_values['move_speed']
        elif message == 'Down':
            self.game_values['paddleright_position_z'] += self.game_values['move_speed']

    def connect(self):
        self.accept()
        threading.Thread(target=self.update_ball_pos).start()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        #while self.game_values['finished'] == False:
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        print(message)
        if message == 'Stop':
            self.game_values['finished'] = True
        self.update_right_paddle_pos(message)
        
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