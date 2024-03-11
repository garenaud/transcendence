from django.urls import path, include
from  . import views

urlpatterns = [
	path("", views.update_pos),
	path("pong", views.render_pong),
	path("get_positions", views.get_positions),
	path("websocket", views.render_websocket)
]
