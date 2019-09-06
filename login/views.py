
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from .models import User
# Create your views here.
def user_login(request):
    return render(request, 'login/Login.html')
def user_register(request):
    return render(request, 'login/Register.html')

def register_user_info(request):
    if request.method == "POST":
        username = request.POST.get('form-username')
        password = request.POST.get('form-password')
        user = User.objects.filter(name=username)
        if not user:
            new_user = User(name=username, password=password)
            new_user.save()
            login_url = reverse('login:login')
            return redirect(login_url)
        else:
            return HttpResponse("User already exist!!!")

def login_success(request):
    if request.method == 'POST':
        username = request.POST.get("form-username")
        # print(username)
        user = User.objects.filter(name=username)
        if user:
            for i in user.values("password"):
                if request.POST.get("form-password") == i["password"]:
                    return redirect(reverse('search:get_data'))
                else:
                    return HttpResponse("Password error!!!")
        else:
            return HttpResponse("User does not exist!!!")
