from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SavedAdventureViewSet, SearchAdventureView

router = DefaultRouter()
router.register('saved-adventures', SavedAdventureViewSet, basename='saved-adventures')

urlpatterns = [
    path('', include(router.urls)),
    path('search/', SearchAdventureView.as_view(), name='search-adventures'),
]