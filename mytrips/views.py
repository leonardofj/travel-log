from django.shortcuts import render, get_object_or_404
from django.contrib import messages
from mytrips.utils.geolocations import get_location
from .models import Country, City, Stop, Trip
from django.db.models import Count, Max
from django.http import HttpResponseRedirect
from django.urls import reverse


def main(request):
    all_trips = Trip.objects.all().order_by("-start")
    stats = {
        "countries": Country.objects.filter(visited=True).count(),
        "cities": City.objects.filter(visited=True).count(),
        "trips": Trip.objects.count(),
        "continents": (
            Country.objects.filter(visited=True).values("continent").distinct().count()
        ),
        "total_duration": sum([item.duration for item in all_trips]),
    }
    context = {"stats": stats, "trips": all_trips}
    return render(request, "main.html", context)


def countries(request):
    all_countries = (
        Country.objects.filter(visited=True)
        .annotate(
            visits=Count("city__stop__trip", distinct=True),
            last_visit=Max("city__stop__trip__end"),
        )
        .order_by("-last_visit", "visits")
    )
    context = {
        "countries": all_countries,
    }
    return render(request, "countries.html", context)


def country_details(request, id):
    country = get_object_or_404(Country, id=id)
    context = {
        "country": country,
    }
    return render(request, "country_details.html", context)


def cities(request):
    countries = Country.objects.filter(visited=True).order_by("name")
    cities_list = (
        City.objects.annotate(
            visits=Count("stop__trip", distinct=True), last_visit=Max("stop__departure")
        )
        .values("name", "country__name", "visited", "visits", "last_visit")
        .order_by("-id")
    )
    context = {"cities": cities_list, "countries": countries}
    return render(request, "cities.html", context)


def stops(request):
    stops = Stop.objects.values(
        "city__country__name", "city__name", "arrival", "departure", "trip__title"
    ).order_by("-departure")
    context = {
        "stops": stops,
    }
    return render(request, "stops.html", context)


def trip_details(request, id):
    trip = get_object_or_404(Trip, id=id)
    stops = (
        Stop.objects.filter(trip=trip)
        .order_by("arrival")
        .values("city__country__name", "city__name", "arrival", "departure")
    )
    context = {"trip": trip, "stops": stops}
    return render(request, "trip_details.html", context)


def add_city(request):
    city_name = request.POST["city_name"]
    state = request.POST["state"]
    country = get_object_or_404(Country, pk=request.POST.get("country"))
    city_data = {
        "name": city_name,
        "visited": True,
        "country": country,
        "state": state,
    }
    location = get_location(city_name, country.name, state)
    if location:
        city_data["lat"] = location["lat"]
        city_data["lon"] = location["lon"]
        new_city = City(**city_data)
        new_city.save()
        messages.success(request, f"New city saved: {city_name}, {country.name}")
    else:
        messages.error(
            request, f"Coordinates not found for city {city_name} in {country.name}"
        )

    return HttpResponseRedirect(reverse("cities"))


def add_stops(request):
    city = request.POST["city"]
    arrival = request.POST["arrival"]
    departure = request.POST["departure"]
    trip = request.POST["trip"]

    return HttpResponseRedirect(reverse("stops"))
