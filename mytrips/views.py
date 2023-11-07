from django.http import HttpResponse
from django.template import loader

from mytrips.utils.geolocations import get_location
from .models import Country, City, Stop, Trip
from django.db.models import Sum, Count, Max
from django.core.exceptions import ObjectDoesNotExist


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
    template = loader.get_template("main.html")
    context = {"stats": stats, "trips": all_trips}
    return HttpResponse(template.render(context, request))


def countries(request):
    all_countries = (
        Country.objects.filter(visited=True)
        .annotate(
            visits=Count("city__stop__trip", distinct=True),
            last_visit=Max("city__stop__trip__end"),
        )
        .order_by("-last_visit", "visits")
    )
    template = loader.get_template("countries.html")
    context = {
        "countries": all_countries,
    }
    return HttpResponse(template.render(context, request))


def country_details(request, id):
    # TODO: country doesn't exist
    country = Country.objects.get(id=id)
    template = loader.get_template("country_details.html")
    context = {
        "country": country,
    }
    return HttpResponse(template.render(context, request))


def cities(request):
    mydata = (
        City.objects.annotate(
            visits=Count("stop__trip", distinct=True), last_visit=Max("stop__departure")
        )
        .values("name", "country__name", "visited", "visits", "last_visit")
        .order_by("name")
    )
    template = loader.get_template("cities.html")
    context = {
        "cities": mydata,
    }
    return HttpResponse(template.render(context, request))


def stops(request):
    stops = Stop.objects.values(
        "city__country__name", "city__name", "arrival", "departure", "trip__title"
    ).order_by("-departure")
    template = loader.get_template("stops.html")
    context = {
        "stops": stops,
    }
    return HttpResponse(template.render(context, request))


def trip_details(request, id):
    trip = Trip.objects.get(id=id)
    stops = (
        Stop.objects.filter(trip=trip)
        .order_by("arrival")
        .values("city__country__name", "city__name", "arrival", "departure")
    )
    template = loader.get_template("trip_details.html")
    context = {"trip": trip, "stops": stops}
    return HttpResponse(template.render(context, request))
