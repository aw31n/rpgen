from django.shortcuts import render
from django.http import HttpResponse

def index(request, *args, **kwargs):
    return render(request, "frontend/index.html")

def ping(request):
    return HttpResponse('Pong')
