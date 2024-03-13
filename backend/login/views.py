from django.shortcuts import render
from database.models import Users, Games
from django.shortcuts import render, redirect
from rest_framework.response import Response
from rest_framework import status
from database.serializers import UsersSerializer
from django.http import	HttpResponse, JsonResponse
from django.contrib import messages, auth
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .forms import SignupForm, LoginForm

def home_page(request):
	return render(request, "login/home.html")

def signup_form(request):
	if request.method == 'POST':
		form = SignupForm(request.POST)
		if form.is_valid():
			form.save()
			messages.success(request, "Your account has been created successfully")
			return redirect("home_page")
		else:
			messages.error(request, "Error")
	
	else:
		form = SignupForm()
	return render(request, "login/signup.html", {'form' : form})


def login_form(request):
	form = LoginForm()
	if request.method == 'POST':
		form = LoginForm(request, data=request.POST)
		if form.is_valid():
			username = request.POST['username']
			password = request.POST['password']

			user = authenticate(request, username=username, password=password)

			if user is not None:
				auth.login(request, user)
				return redirect("home_page")
			else:
				return redirect("login/login.html")
	return render(request, "login/login.html", {'form' : form})
		
def logout_form(request):
	auth.logout(request)

	return redirect("home_page")

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

def test(request):
	if request.method == 'GET':
		data = json.load(request)
		username = data['email']
		password = data['password']
		user = authenticate(request, username=username, password=password)
		if user is not None:
			auth.login(request, user)
			user = User.objects.get(username=username)
			return JsonResponse({"message" : "OK","id" : user.id, "username" : user.username, "first_name" : user.first_name, "last_name" : user.last_name, "email" : user.email, "password" : user.password, "logged_in" : user.is_authenticated}, safe=False)
		else:
			return JsonResponse({"message" : "KO in get"})
	else:
		return JsonResponse({"message" : "KO"})