from django.conf.urls import url
from django.urls import path
from . import views

app_name = 'search'
urlpatterns = [
    url(r'^$', views.get_data, name="get_data"),
    url(r'^data_analyse/', views.data_analyse, name="data_analyse"),
    url(r'^ms_scatter/', views.ms_scatter, name="ms_scatter")
]