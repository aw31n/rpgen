from django.urls import path, re_path, include
from rest_framework import routers
from . import views


from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register(r'characters', views.CharacterViewSet, basename='characters')

urlpatterns =   [
  
    re_path(r'token/refresh/?', TokenRefreshView.as_view(), name='token_refresh'),
    re_path(r'token/?', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    re_path(r'register/?', views.RegisterView.as_view(), name='auth_register'),
    re_path(r'test/?', views.testEndPoint),
    path("openai/story/", views.create_story),
    path("openai/image/", views.create_image),
    # re_path(r'characters/?', views.characters_list),

    # path('ping', views.ping),
    path('routes', views.getRoutes),
    
    # re_path(r'^(?:.*)/?', include(router.urls)),
    path('', include(router.urls)),
    re_path(r'^(?:.*)/?', views.unknown_endpoint),
]
