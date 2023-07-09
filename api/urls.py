from django.urls import path, re_path, include
from rest_framework import routers
from . import views


from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register(r'characters', views.CharacterViewSet, basename='characters')
router.register(r'character_images', views.CharacterImageViewSet, basename='character_images')

urlpatterns =   [
  
    re_path(r'token/refresh/?', TokenRefreshView.as_view(), name='token_refresh'),
    re_path(r'token/?', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    re_path(r'register/?', views.RegisterView.as_view(), name='auth_register'),
    re_path(r'test/?', views.testEndPoint),
    path("openai/story/", views.create_story),
    path("openai/image/", views.create_image),
    path("mnist/get_image/", views.get_mnist_image),
    path("mnist/classify_image/", views.classify_mnist_image),
    # re_path(r'characters/?', views.characters_list),

    # path('ping', views.ping),
    path('routes', views.getRoutes),
    
    # re_path(r'^(?:.*)/?', include(router.urls)),
    path('', include(router.urls)),
    re_path(r'^(?:.*)/?', views.unknown_endpoint),
]
