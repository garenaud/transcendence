from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Users, Games
from .serializers import UsersSerializer


# Create your views here.

def users_list(request):
	users = Users.objects.all()
	serializer = UsersSerializer(users, many=True)
	return JsonResponse(serializer.data, safe=False)


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






