from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
    path("chat/<str:room_name>/", consumers.ChatConsumer.as_asgi()),
	path("game/<str:room_name>/", consumers.AsyncGameConsumer.as_asgi()),
]