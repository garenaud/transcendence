from typing import Any
from django.db import models
from rest_framework import generics
# Create your models here.

class Users(models.Model):
	name = models.CharField(max_length=20)
	login = models.CharField(max_length=20)
	password = models.CharField(max_length=100)
 
	def __str__(self) -> str:
		return self.name
	
class Games(models.Model):
	player1 = models.ForeignKey(Users, on_delete=models.CASCADE, related_name="player1", null=True)
	player2 = models.ForeignKey(Users, on_delete=models.CASCADE, related_name="player2", null=True)
	#code = models.CharField(max_length=10)
	finished = models.BooleanField(default=False)
	scoreleft = models.IntegerField(default=0)
	scoreright = models.IntegerField(default=0)
	ball_position_x = models.FloatField(default=0.0)
	ball_position_z = models.FloatField(default=0.0)
	ball_velocity_x = models.FloatField(default=0.0)
	ball_velocity_z = models.FloatField(default=0.0)
	paddleleft_position_x = models.FloatField(default=0.0)
	paddleleft_position_z = models.FloatField(default=0.0)
	paddleright_position_x = models.FloatField(default=0.0)
	paddleright_position_z = models.FloatField(default=0.0)
	def __str__(self):
		return self.code
