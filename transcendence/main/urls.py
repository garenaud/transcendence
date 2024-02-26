from django.urls import path, include
from  . import views


urlpatterns = [
	path("", views.render_index, name="index"),
	path("pong", views.render_pong, name="pong"),
	path("userlist", views.get_user_list, name="user_list"),
	path("userlist/", views.get_user_list, name="user_list/"),
	path("user/<int:id>", views.get_user_from_id),
	path("<int:id>", views.render_user_login,  name="user_login"),
	path("user/create", views.register_form, name="register_form"),
	#path("user/create", views.create_new_user, name="create_user"),
	path("user/delete/<int:id>", views.delete_user_from_id),
	path("user/delete/<str:login>", views.delete_user_from_login),
	path("form", views.register_form)
]