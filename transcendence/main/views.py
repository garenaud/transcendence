from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Users, Games
from .serializers import UsersSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status



# Create your views here.
@api_view(["GET", "POST"])

def users_list(request):
	if request.method == 'GET':
		users = Users.objects.all()
		serializer = UsersSerializer(users, many=True)
		return JsonResponse({'Users' : serializer.data}, safe=False)
	if request.method == 'POST':
		serializer = UsersSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)


def get_user_from_id(request, id):
	user = Users.objects.get(id=id)
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






