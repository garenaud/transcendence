from django.urls import path, include
from  . import views

urlpatterns = [
	path("userlist", views.get_user_list),
	path("user/<int:id>", views.user_by_id),
	path("user/create", views.create_new_user),
	path("delete/<int:ind>", views.delete_user_by_id),
	path("gamelist", views.get_game_list)
]

