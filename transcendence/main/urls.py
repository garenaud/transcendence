from django.urls import path, include
from  . import views


urlpatterns = [
	path("<int:id>", views.render_index,  name="index"),
	path("pong", views.render_pong, name="pong")
]