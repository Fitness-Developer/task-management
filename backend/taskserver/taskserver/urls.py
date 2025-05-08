"""
URL configuration for taskserver project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tasks.views import TaskViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from acc.views import RegisterView,CurrentUserView
from teams.views import TeamsViewSet, TaskTeamViewSet, UserViewSet


router = DefaultRouter()
router.register(r'tasks', TaskViewSet,basename='tasks')
router.register(r'teams', TeamsViewSet,basename='teams')
router.register(r'tasksTeam', TaskTeamViewSet,basename='tasksTeam')
router.register(r'users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/current_user/', CurrentUserView.as_view(), name='current_user'),
]
