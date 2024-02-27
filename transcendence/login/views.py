from django.shortcuts import render
from database.models import Users, Games
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from database.serializers import UsersSerializer
from django.http import	HttpResponse
from django.contrib import messages, auth

#Render the index page from templates/login/index.html
def render_index(request):
	return render(request, "login/index.html")

def login_from_form(request):
	if request.method == 'POST':
		login = request.POST['login']
		password = request.POST['password']
		queryset = Users.objects.filter(login=login)
		if queryset.exists():
			user = queryset[0]
			if user.password == password:
				return HttpResponse("Welcome, " + login + " you are now logged in", status=status.HTTP_200_OK)
			else:
				return HttpResponse("No user:password matches, please try again", status=status.HTTP_404_NOT_FOUND)
		else:
			return HttpResponse("No user:password matches, please try again", status=status.HTTP_404_NOT_FOUND)
	else:
		return HttpResponse("Method not allowed", status=status.HTTP_405_METHOD_NOT_ALLOWED)

#Render the register form from templates/login/register.html
def render_register_form(request):
	return render(request, "login/register.html")

#Create a user from the register form 
def create_user_from_form(request):
	if request.method == 'POST':
		new_name = request.POST['name']
		new_login = request.POST['login']
		new_password = request.POST['password']
		if Users.objects.filter(login=new_login).exists():
			messages.info(request, "User with this login already exists")
			return render(request, "login/register.html")
		new_user = Users(name=new_name, login=new_login, password=new_password)
		new_user.save()
		return HttpResponse("User " + new_name + " with login " + new_login + " has been created", status=status.HTTP_201_CREATED)
	else:
		return HttpResponse("Method not allowed", status=status.HTTP_405_METHOD_NOT_ALLOWED)