from django.conf.urls import url
from . import views
app_name = 'login'
urlpatterns = [
    url(r'^$', views.user_login, name='login'),
    url(r'^register/$', views.user_register, name='register'),
    url(r'register_user_info/$', views.register_user_info, name='info'),
    url(r'login_success/$', views.login_success, name='login_success'),
]
