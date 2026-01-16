"""
URL configuration for Komix project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from django.urls import path
from ninja import NinjaAPI
from ninja.security import SessionAuth
from kAuth.api import router as auth_router
from projects.api import router as projects_router
from feed.api import router as feed_router


api = NinjaAPI(auth=SessionAuth)
api.add_router("kAuth", auth_router, auth=None)
api.add_router("projects", projects_router)
api.add_router("feed", feed_router)

urlpatterns = [path("admin/", admin.site.urls), path("api/v1/", api.urls)]
