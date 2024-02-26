from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from .models import Users, Games
from .serializers import UsersSerializer, CreateUserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages, auth

# Create your views here.
@api_view(["GET", "POST"])

def register_form(request):
	context = {}

	if request.method == 'POST':
		name = request.POST['name']
		login = request.POST['login']
		password = request.POST['password']

		if Users.objects.filter(login=login).exists():
			messages.info(request, "User with this login already exists")
			return render(request, "main/register.html")
		else:
			newUser = Users.objects.create(name=name, login=login, password=password)
			newUser.save()
			return HttpResponse("User " + name + " with login " + login + " has been created", status=status.HTTP_201_CREATED)
	elif request.method == 'GET':
		return render(request, "main/register.html")

def get_user_list(request):
	if request.method == 'GET':
		users = Users.objects.all()
		serializer = UsersSerializer(users, many=True)
		return JsonResponse({'Users' : serializer.data}, safe=False)
	else:
		return Response("Method not allowed", status=status.HTTP_405_METHOD_NOT_ALLOWED)

def create_new_user(request):
	if request.method == 'POST':
		serializer = UsersSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
		return Response("User created successfuly", status=status.HTTP_201_CREATED)
	else:
		return Response("Method not allowed", status=status.HTTP_405_METHOD_NOT_ALLOWED)

def delete_user_from_id(request, id):
	if (request.method == 'GET'):
		user = Users.objects.get(id=id)
		user.delete()
		return HttpResponse("User " + str(id) + " has been deleted")
	else:
		return Response("Method not allowed", status=status.HTTP_405_METHOD_NOT_ALLOWED)

def delete_user_from_login(request, login):
	if (request.method == 'GET'):
		user = Users.objects.get(login=login)
		user.delete()
		return HttpResponse("User " + login + " has been deleted")
	else:
		return Response("Method not allowed", status=status.HTTP_405_METHOD_NOT_ALLOWED)

def get_user_from_id(request, id):
	user = Users.objects.get(id=id)
	serializer = UsersSerializer(user)
	return JsonResponse(serializer.data)

def get_user_from_login(request, login):
	user = Users.objects.get(login=login)
	serializer = UsersSerializer(user)
	return JsonResponse(serializer.data)

def render_index(request):
	user = Users.objects.all()
	return HttpResponse(user)

def render_user_login(request, id):
	try:
		user = Users.objects.get(id=id)
		return HttpResponse("<h1>%s</h1>" %user.login)
	except:
		return HttpResponse("<h1>%s</h1>" %id)

def render_pong(request):
	return render(request, "main/test.html")

def render_form(request):
	return render(request, "main/register.html")






