from django.urls import path, include
from  . import views

urlpatterns = [
	path("", views.render_index, name="render_index"),
	path("sign-in", views.login_from_form, name="login_from_form"),
	path("register/", views.render_register_form, name="render_register_form"),
	path("register/create", views.create_user_from_form, name="create_user_from_form")
]
