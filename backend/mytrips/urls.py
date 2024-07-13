from . import views
from django.urls import include, path
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r"stats", views.StatsViewSet, basename="stats")
router.register(r"countries", views.CountryViewSet, basename="countries")
router.register(r"trips", views.TripViewSet, basename="trips")
router.register(r"cities", views.CityViewSet, basename="cities")
router.register(r"stops", views.StopViewSet, basename="stops")
router.register(r"plans", views.PlanViewSet, basename="plans")

urlpatterns = [path("", include(router.urls))]
