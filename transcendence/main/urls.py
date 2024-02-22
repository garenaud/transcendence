from django.urls import path, include
from  . import views


urlpatterns = [
	path('', views.render_index, name='index'),
	path('v1', views.v1, name='v1')
]