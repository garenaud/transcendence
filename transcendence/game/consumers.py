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
        'ball_velocity_z' : 6.9,
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
        self.send(text_data=json.dumps(self.game_values))

        
class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        self.send(text_data=json.dumps({"message": message}))
	
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