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


#GET:
#	/userlist = renvoie tout les users de la DB
#	/user/id = renvoie le user avec l'id spécifié, sinon renvoie une page d'erreur appropriée
#
#POST:
#	/user/create = creer un nouveau user et le stocke dans la DB, sinon renvoie une page d'erreur appropriée
#
#PUT:
#	/user/id = update le user avec l'id sécpifiéé et le stocke dans la DB
#
#DELETE:
#	/user/id = supprime le user avec l'id spécifié de la DB, si le user n'existe pas, renvoyer une erreure approprié
#
#
#
#
#
#
#
#
