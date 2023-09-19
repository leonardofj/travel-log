from django.urls import path
from . import views

urlpatterns = [
    path("", views.main, name="main"),
    path("countries/", views.countries, name="countries"),
    path("countries/<int:id>", views.country_details, name="country_details"),
    path("cities/", views.cities, name="cities"),
    path("trips/<int:id>", views.trip_details, name="trip_details"),
    path("create/", views.CityCreateView.as_view(), name="city-create"),
    # path(
    #     "city/<int:pk>/update",
    #     views.CityUpdateView.as_view(),
    #     name="city-update",
    # ),
]
