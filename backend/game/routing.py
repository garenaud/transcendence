from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/chatcool/$", consumers.ChatConsumer.as_asgi()),
	re_path(r"game/$", consumers.GameConsumer.as_asgi()),
]