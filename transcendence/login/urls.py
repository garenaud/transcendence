from django.urls import path, include
from  . import views

urlpatterns = [
	path("", views.login_form, name="login_form"),
	path("register/", views.register_form, name="register_form"),
	path("home", views.home_page, name="home_page")
]
