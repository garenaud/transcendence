from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse

def render_index(request):
	return render(request, "frontend/index.html")