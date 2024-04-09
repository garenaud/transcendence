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
	player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player1", null=True)
	player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player2", null=True)
	p1_id = models.IntegerField(default=-1)
	p2_id = models.IntegerField(default=-1)
	#code = models.CharField(max_length=10)
	finished = models.BooleanField(default=False)
	scoreleft = models.IntegerField(default=0)
	scoreright = models.IntegerField(default=0)
	p1_score = models.IntegerField(default=0)
	p2_score = models.IntegerField(default=0)
	room_group_name = models.CharField(max_length=100, default="")
	room_id = models.IntegerField(default=-1)
	def __str__(self):
		return self.code
