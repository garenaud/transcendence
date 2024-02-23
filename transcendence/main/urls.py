from django.urls import path, include
from  . import views


urlpatterns = [
	path("", views.render_index, name="index"),
	path("<int:id>", views.render_user_login,  name="user_login"),
	path("pong", views.render_pong, name="pong"),
	path("userslist", views.users_list, name="users_list")
]