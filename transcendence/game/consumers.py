from channels.generic.websocket import WebsocketConsumer
import json

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
    def connect(self):
        self.accept()

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
    
    def update_ball(self):
        pass

    def update_right_paddle(self, message):
        if message == 'Up':
            self.game_values['paddleright_position_z'] -= self.game_values['move_speed']
        elif message == 'Down':
            self.game_values['paddleright_position_z'] += self.game_values['move_speed']

    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        self.update_right_paddle(message)
        self.send(self.game_values)
        
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