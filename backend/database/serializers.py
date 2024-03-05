from rest_framework import serializers
from .models import Users, Games


class UsersSerializer(serializers.ModelSerializer):
	class Meta:
		model =  Users
		fields = ['id', 'name', 'login', 'password']

class CreateUserSerializer(serializers.ModelField):
	class Meta:
		model = Users
		fields = ['name', 'login', 'password']