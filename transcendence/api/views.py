from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from main.models import Users, Games
from main.serializers import UsersSerializer, CreateUserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages, auth
from django.shortcuts import render

# Create your views here.

def get_user_list(request):
	if (request.method == 'GET'):
		pass
	else:
		pass

def user_by_id(request):
	if (request.method == 'GET'):
		pass
	elif (request.method == 'PUT'):
		pass
	else:
		pass

def create_new_user(request):
	if request.method == 'POST':
		pass
	else:
		pass

def delete_user_by_id(request):
	if request.method == "DELETE":
		pass
	else:
		pass


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
