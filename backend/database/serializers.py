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
		fields = ['id', 'player1', 'player2', 'finished', 'p1_score', 'p2_score','room_group_name']
