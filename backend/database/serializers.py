from rest_framework import serializers
from .models import Users, Games, userProfile, Tournament
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model =  User
		fields = ['id', 'first_name', 'last_name', 'username', 'email', 'is_authenticated']

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
		fields = ['id', 'p1_id', 'p2_id', 'finished', 'p1_score', 'p2_score','room_group_name', 'room_id']

class UserProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = userProfile
		fields = ['user', 'game_won', 'game_lost', 'tournament_alias','tournament_won', 'tournament_lost', 'friendlist', 'online']

class TournamentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Tournament
		fields = ['p1_id', 'p2_id','p3_id', 'p4_id','p1_alias', 'p2_alias','p3_alias', 'p4_alias', 'game1_id', 'game2_id', 'game3_id', 'full', 'finished', 'connected']

