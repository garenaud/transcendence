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
	player1 = models.ForeignKey(Users, on_delete=models.CASCADE, related_name="p1")
	#player2 = models.ForeignKey(Users, on_delete=models.CASCADE, related_name="p2")
	code = models.CharField(max_length=10)
	finished = models.BooleanField(default=False)

	def __str__(self):
		return self.code
