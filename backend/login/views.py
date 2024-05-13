from django.shortcuts import render
from database.models import Games, userProfile
from django.shortcuts import render, redirect
from rest_framework.response import Response
from rest_framework import status
from django.http import	HttpResponse, JsonResponse
from django.contrib import messages, auth
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .forms import SignupForm, LoginForm
from django.http import JsonResponse
import json
from database.serializers import UserSerializer
from django.contrib.auth.hashers import make_password


def home_page(request):
	return render(request, "login/home.html")

def register(request):
	if request.method == 'POST':
		print(request.POST['password1'])
		print(request.POST['password2'])
		if request.POST['password1'] != request.POST['password2']:
			return JsonResponse({ 'message' : 'Passwords did not match'}, status=403)
		password = make_password(request.POST['password1'])
		user = User.objects.filter(username=request.POST['username'])
		if User.objects.filter(username=request.POST['username']).exists() or User.objects.filter(email=request.POST['email']).exists():
			return JsonResponse({ "message" : "User with same username / email already exists in the database"}, status=409)
		else:
			user = User(username=request.POST['username'], first_name=request.POST['first_name'],  last_name=request.POST['last_name'], email=request.POST['email'], password=password)
			user.save()
			userprofile = userProfile(user=user)
			userprofile.save()
			return JsonResponse({ "message" : "User " + request.POST['username'] + " has been added to database"}, status=201)
	else:
		return JsonResponse({ "message" : "Method not allowed"}, status=405)

def login(request):
	if request.method == 'POST':
		data = json.loads(request.body)
		username = data['username']
		password = data['password']
		user = authenticate(username=username, password=password)
		if user is not None:
			auth.login(request, user)
			user = User.objects.get(username=username)
			userprofile = userProfile.objects.get(user=user)
			userprofile.online = True
			userprofile.save()
			return JsonResponse({"message" : "OK", "id" : user.id, "username" : user.username, "first_name" : user.first_name, "last_name" : user.last_name, "email" : user.email}, status=200)
		else:
			return JsonResponse({"message" : 'KO'}, status=404)
	else:
		return JsonResponse({"message" : "KO"}, status=405)

def logout(request, id):
	user = User.objects.get(id=id)
	if user.is_authenticated:
		userprofile = userProfile.objects.get(user=user)
		userprofile.online = False
		userprofile.save()
		auth.logout(request)
		return JsonResponse({"message" : "OK"})

def login_form(request):
	form = LoginForm()
	if request.method == 'POST':
		print(request.POST)
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
		else:
			return JsonResponse({"message" : "error"})
	return render(request, "login/login.html", {'form' : form})
		


	
def get_session_username(request):
	return JsonResponse({'user_id' : request.session['user_id']})

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
