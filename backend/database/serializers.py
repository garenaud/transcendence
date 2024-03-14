from rest_framework import serializers
from .models import Users, Games
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model =  User
		fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password']

class UsersSerializer(serializers.ModelSerializer):
	class Meta:
		model =  Users
		fields = ['id', 'name', 'login', 'password']

class CreateUserSerializer(serializers.ModelField):
	class Meta:
		model = Users
		fields = ['name', 'login', 'password']

class GamesSerializer(serializers.ModelSerializer):
	class Meta:
		model = Games
		fields = ['player1', 'player2', 'finished', 'scoreleft', 'scoreright', 'ball_position_x', 'ball_position_z', 'ball_velocity_x', 'ball_velocity_z', 'paddleleft_position_x', 'paddleleft_position_z', 'paddleright_position_x', 'paddleright_position_z']
