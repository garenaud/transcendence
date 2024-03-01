from django.urls import path, include
from  . import views

urlpatterns = [
	path("", views.update_pos),
	path("pong", views.render_pong),
]
