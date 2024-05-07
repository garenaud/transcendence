from typing import Any
from django.db import models
from django.contrib.auth.models import User
from rest_framework import generics
# Create your models here.

class Users(models.Model):
	name = models.CharField(max_length=20)
	login = models.CharField(max_length=20)
	password = models.CharField(max_length=100)
	
	def __str__(self) -> str:
		return self.name
	
class Games(models.Model):
	player1 = models.OneToOneField(User, on_delete=models.CASCADE, related_name="player1", null=True)
	player2 = models.OneToOneField(User, on_delete=models.CASCADE, related_name="player2", null=True)
	p1_id = models.IntegerField(default=-1)
	p2_id = models.IntegerField(default=-1)
	#code = models.CharField(max_length=10)
	finished = models.BooleanField(default=False)
	started = models.BooleanField(default=False)
	full = models.BooleanField(default=False)
	private = models.BooleanField(default=False)
	scoreleft = models.IntegerField(default=0)
	scoreright = models.IntegerField(default=0)
	p1_score = models.IntegerField(default=0)
	p2_score = models.IntegerField(default=0)
	room_group_name = models.CharField(max_length=100, default="")
	room_id = models.IntegerField(default=-1)
	tournament_id = models.IntegerField(default=-1)
	def __str__(self):
		return self.code

class Tournament(models.Model):
	tournament_id = models.IntegerField(default=-1)
	p1_id = models.IntegerField(default=-1)
	p2_id = models.IntegerField(default=-1)
	p3_id = models.IntegerField(default=-1)
	p4_id = models.IntegerField(default=-1)
	p1_alias = models.CharField(max_length=100, default="")
	p2_alias = models.CharField(max_length=100, default="")
	p3_alias = models.CharField(max_length=100, default="")
	p4_alias = models.CharField(max_length=100, default="")
	game1_id = models.IntegerField(default=-1)
	game2_id = models.IntegerField(default=-1)
	game3_id = models.IntegerField(default=-1)
	full = models.BooleanField(default=False)
	finished = models.BooleanField(default=False)
	connected = models.IntegerField(default=0)

class userProfile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user', null=False)
	game_won = models.IntegerField(default=0)
	game_lost = models.IntegerField(default=0)
	tournament_won = models.IntegerField(default=0)
	tournament_lost = models.IntegerField(default=0)
	friendlist = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
	online = models.BooleanField(default=False)
	#profile_picture = models.ImageField(upload_to='./downloads')