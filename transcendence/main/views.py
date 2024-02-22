from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def render_index(request):
	return HttpResponse("<h1>index of transcendence</h1>")

def v1(request):
	return HttpResponse("<h1>V1 view</h1>")



