from django.urls import path, include
from  . import views

urlpatterns = [
	path("userlist", views.get_user_list),
	path("user/<int:id>", views.user_by_id),
	path("user/create", views.create_new_user),
	path("delete/<int:ind>", views.delete_user_by_id),
	path("gamelist", views.get_game_list),
	path("game/<int:gameid>", views.get_game_by_id),
	path("game/create/", views.create_game),
	path("game/search/", views.search_game),
	path("tournament/create/<int:userid>", views.create_tournament),
	path("tournament/join/<int:tournamentid>/<int:userid>", views.join_tournament),
	path("userprofilelist", views.get_user_profile_list),
	path("tournamentlist", views.get_tournament_list),
	path("history/<int:userid>", views.get_user_history),
	path("update/<int:userid>", views.update_user_info),
	path("√", views.cursed)
]

