from django.urls import path
from . import views

urlpatterns = [
    path("", views.main, name="main"),
    path("countries/", views.countries, name="countries"),
    path("countries/<int:id>", views.country_details, name="country_details"),
    path("cities/", views.cities, name="cities"),
    path("stops/", views.stops, name="stops"),
    path("trips/<int:id>", views.trip_details, name="trip_details"),
]
