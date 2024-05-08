from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from database.models import Users, Games, Tournament, userProfile
from database.serializers import UsersSerializer, CreateUserSerializer, UserSerializer, GamesSerializer, UserProfileSerializer, TournamentSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages, auth
from django.shortcuts import render
from django.contrib.auth.models import User
import random



#Returns all user in the database
@api_view(['GET'])
def get_user_list(request):
	if (request.method == 'GET'):
		users = User.objects.all()
		serializer = UserSerializer(users, many=True)
		return Response(serializer.data)
	else:
		return Response("Unauthorized method", status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_user_profile_list(request):
	if (request.method == 'GET'):
		profiles = userProfile.objects.all()
		serializer = UserProfileSerializer(profiles, many=True)
		return Response(serializer.data)
	else:
		return Response("Unauthorized method", status=status.HTTP_401_UNAUTHORIZED)

#Either returns the user with the specified id or update the user specified by id in the database
@api_view(['GET', 'PUT'])
def user_by_id(request, id):
	if (request.method == 'GET'):
		user = User.objects.get(id=id)
		serializer = UserSerializer(user)
		return Response(serializer.data, status=status.HTTP_200_OK)
	elif (request.method == 'PUT'):
		queryset = User.objects.filter(id=id)
		serializer = UserSerializer(data=request.data)
		if serializer.is_valid():
			user = queryset[0]
			user.first_name = serializer.data['first_name']
			user.last_name = serializer.data['last_name']
			user.username = serializer.data['username']
			user.email = serializer.data['email']
			user.password = serializer.data['password']
			user.save(update_fields=['first_name', 'last_name', 'username', 'email', 'password'])
			return Response(serializer.data, status=status.HTTP_200_OK)
	else:
		return Response("Method not allowed", status=status.HTTP_405_METHOD_NOT_ALLOWED)

#Create a new user in the database with the attributes specified in the form
@api_view(['POST'])
def create_new_user(request):
	if request.method == 'POST':
		serializer = UserSerializer(data=request.data)
		if serializer.is_valid():
			user = User.objects.filter(login=serializer.data['login'])
			if not user.exists():
				user = User(name=serializer.data['name'], login=serializer.data['login'], password=serializer.data['password'])
				user.save()
				return Response("User " + serializer.data['login'] + " has been added to database", status=status.HTTP_201_CREATED)
			else:
				return Response("User with login " + serializer.data['login'] + " already exists in the database", status=status.HTTP_409_CONFLICT)
		else:
			return Response("Data of new user is not valid", status=status.HTTP_400_BAD_REQUEST)
	else:
		return Response("Method not allowed", status=status.HTTP_405_METHOD_NOT_ALLOWED)

#Delete user with specified id from the database
@api_view(['DELETE'])
def delete_user_by_id(request, id):
	if request.method == "DELETE":
		queryset = User.objects.filter(id=id)
		if queryset.exists():
			user = queryset[0]
			user.delete()
			return Response("User with id " + str(id) + " was successfuly deleted from the database", status=status.HTTP_200_OK)
		else:
			return Response("User with id " + str(id) + " was not found in the database", status=status.HTTP_404_NOT_FOUND)
	else:
		return Response("Method not allowed", status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
def get_game_list(request):
	if (request.method == 'GET'):
		games = Games.objects.all()
		serializer = GamesSerializer(games, many=True)
		return Response(serializer.data)
	else:
		return Response("Unauthorized method", status=status.HTTP_401_UNAUTHORIZED)
	
@api_view(['GET'])
def get_game_by_id(request, gameid):
	if (request.method == 'GET'):
		game = Games.objects.filter(room_id=gameid).count()
		if game == 0:
			return Response({"message" : "Not found"})
		else:
			try:
				game = Games.objects.get(room_id=gameid, finished=False)
				serializer = GamesSerializer(game)
				return Response({"message" : serializer.data})
			except:
				return Response({"message" : "Game is already finished"})
	else:
		return Response("Unauthorized method", status=status.HTTP_401_UNAUTHORIZED)
	

@api_view(['GET'])
def create_game(request):
	if request.method == 'GET':
		newid = random.randint(1, 9999)
		while Games.objects.filter(room_id=newid).count() != 0:
			newid = random.randint(1, 9999)
		return Response({"message" : "ok", 'id' : newid}, status=status.HTTP_200_OK)
	else:
		return Response("Unauthorized method", status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def search_game(request):
	if request.method == 'GET':
		while True:
			try:
				games = Games.objects.filter(started=False, finished=False, full=False)
				id = games[0].room_id
				return Response({"message" : "ok", 'id' : id})
			except:
				newid = random.randint(1, 9999)
				while Games.objects.filter(room_id=newid).count() != 0:
					newid = random.randint(1, 9999)
				return Response({"message" : "ok", 'id' : newid}, status=status.HTTP_200_OK)
	else:
		return Response("Unauthorized method", status=status.HTTP_401_UNAUTHORIZED)
	

@api_view(['GET'])
def create_tournament(request):
	if request.method == 'GET':
		tournamentid = create_random_tournament_id(1, 9999)
		game1id = create_random_game_id(1, 9999)
		game2id = create_random_game_id(1, 9999)
		game3id = create_random_game_id(1, 9999)
		tournoi = Tournament(game1_id=game1id, game2_id=game2id, game3_id=game3id, tournament_id=tournamentid)
		tournoi.save()
		return Response({'tournamentid' : tournamentid, 'game1id' : game1id, 'game2id' : game2id, 'game3id' : game3id})
	else:
		return Response("Unauthorized method", status=status.HTTP_401_UNAUTHORIZED)
	
@api_view(['POST'])
def join_tournament(request, tournamentid):
	if request.method == 'POST':
		data = json.load(request)
		tournamentid = data['tournamentid']
		playerid = data['userid']
		playernb = 0
		try:
			qs = Tournament.objects.filter(tournament_id=tournamentid, full=False, finished=False)
			tournoi = qs[0]
			if tournoi.p2_id == -1:
				playernb = 2
			elif tournoi.p3_id == -1:
				playernb = 3
			else:
				tournoi.full = True
				playernb = 4
			
			tournoi.save()
			return Response({'message' : 'ok', 'game1id' : tournoi.game1_id, 'game2id' : tournoi.game2_id, 'game3id' : tournoi.game3_id, 'playernb' : playernb})

		except:
			return Response({'message' : 'ko'}, status=status.HTTP_404_NOT_FOUND)
	else:
		return Response("Unauthorized method", status=status.HTTP_401_UNAUTHORIZED)
	

def create_random_game_id(start, end):
	newid = random.randint(start, end)
	while Games.objects.filter(room_id=newid, finished=False).count() != 0:
		newid = random.randint(start, end)
	return newid

def create_random_tournament_id(start, end):
	newid = random.randint(start, end)
	while Tournament.objects.filter(tournament_id=newid, finished=False).count() != 0:
		newid = random.randint(start, end)
	return newid

@api_view(['GET'])
def get_tournament_list(request):
	if (request.method == 'GET'):
		tournaments = Tournament.objects.all()
		serializer = TournamentSerializer(tournaments, many=True)
		return Response(serializer.data)
	else:
		return Response("Unauthorized method", status=status.HTTP_401_UNAUTHORIZED)