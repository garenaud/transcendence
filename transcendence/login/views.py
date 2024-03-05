from django.shortcuts import render
from database.models import Users, Games
from django.shortcuts import render, redirect
from rest_framework.response import Response
from rest_framework import status
from database.serializers import UsersSerializer
from django.http import	HttpResponse
from django.contrib import messages, auth

def home_page(request):
	return render(request, "login/home.html")

def login_form(request):
	if request.method == 'GET':
		return render(request, "login/index.html")
	elif request.method == 'POST':
		login = request.POST['login']
		password = request.POST['password']
		queryset = Users.objects.filter(login=login)
		if queryset.exists():
			user = queryset[0]
			if user.password == password:
				return redirect("home_page")
			else:
				messages.info(request, "No User:Password matches, please try again")
				return redirect("login_form")
		else:
			messages.info(request, "User does not exists")
			return redirect("login_form")
	else:
		return HttpResponse("Method not allowed", status.HTTP_405_METHOD_NOT_ALLOWED)

def register_form(request):
	if request.method == 'GET':
		return render(request, "login/register.html")
	elif request.method == 'POST':
		new_name = request.POST['name']
		new_login = request.POST['login']
		new_password = request.POST['password']
		if Users.objects.filter(login=new_login).exists():
			messages.info(request, "User with this login already exists")
			return render(request, "login/register.html")
		new_user = Users(name=new_name, login=new_login, password=new_password)
		new_user.save()
		messages.info(request, "Your account has been created successfully, please login below")
		return redirect("login_form")
	else:
		return HttpResponse("Method not allowed", status=status.HTTP_405_METHOD_NOT_ALLOWED)



# LOGIN form -> if method == get render login form else if method == post login user
# REGISTER form -> if method == get render register form else if method == post create new user in database
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#