from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from database.models import Users, Games
from database.serializers import UsersSerializer, CreateUserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages, auth
from django.shortcuts import render

# Create your views here.
@api_view(['GET'])
def get_user_list(request):
	if (request.method == 'GET'):
		users = Users.objects.all()
		serializer = UsersSerializer(users, many=True)
		return Response(serializer.data)
	else:
		return Response("Unauthorized method", status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET', 'PUT'])
def user_by_id(request, id):
	if (request.method == 'GET'):
		user = Users.objects.get(id=id)
		serializer = UsersSerializer(user)
		return Response(serializer.data, status=status.HTTP_200_OK)
	elif (request.method == 'PUT'):
		queryset = Users.objects.filter(id=id)
		serializer = UsersSerializer(data=request.data)
		if serializer.is_valid():
			user = queryset[0]
			user.name = serializer.data['name']
			user.login = serializer.data['login']
			user.password = serializer.data['password']
			user.save(update_fields=['name', 'login', 'password'])
			return Response(serializer.data, status=status.HTTP_200_OK)
	else:
		return Response("Method not allowed", status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
def create_new_user(request):
	if request.method == 'POST':
		serializer = UsersSerializer(data=request.data)
		if serializer.is_valid():
			user = Users.objects.filter(login=serializer.data['login'])
			if not user.exists():
				user = Users(name=serializer.data['name'], login=serializer.data['login'], password=serializer.data['password'])
				user.save()
				return Response("User " + serializer.data['login'] + " has been added to database", status=status.HTTP_201_CREATED)
			else:
				return Response("User with login " + serializer.data['login'] + " already exists in the database", status=status.HTTP_409_CONFLICT)
		else:
			return Response("Data of new user is not valid", status=status.HTTP_400_BAD_REQUEST)
	else:
		return Response("Method not allowed", status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['DELETE'])
def delete_user_by_id(request, id):
	if request.method == "DELETE":
		queryset = Users.objects.filter(id=id)
		if queryset.exists():
			user = queryset[0]
			user.delete()
			return Response("User with id " + str(id) + " was successfuly deleted from the database", status=status.HTTP_200_OK)
		else:
			return Response("User with id " + str(id) + " was not found in the database", status=status.HTTP_404_NOT_FOUND)
	else:
		return Response("Method not allowed", status=status.HTTP_405_METHOD_NOT_ALLOWED)


#GET:
#	/userlist = renvoie tout les users de la DB
#	/user/id = renvoie le user avec l'id spécifié, sinon renvoie une page d'erreur appropriée
#
#POST:
#	/user/create = creer un nouveau user et le stocke dans la DB, sinon renvoie une page d'erreur appropriée
#
#PUT:
#	/user/id = update le user avec l'id sécpifiéé et le stocke dans la DB
#
#DELETE:
#	/user/id = supprime le user avec l'id spécifié de la DB, si le user n'existe pas, renvoyer une erreure approprié
#
#
#
#
#
#
#
#
