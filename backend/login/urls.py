from django.urls import path, include
from  . import views

urlpatterns = [
	path("", views.login_form, name="login_form"),
	path("register/", views.signup_form, name="signup_form"),
	path("home/", views.home_page, name="home_page"),
	path("logout/", views.logout_form, name="logout_form"),
	path("test/", views.test, name="test"),
]
