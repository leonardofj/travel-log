from django.http import HttpResponse
from django.template import loader

from mytrips.utils.geolocations import get_location
from .models import Country, City, Stop, Trip
from django.db.models import Sum
from django.core.exceptions import ObjectDoesNotExist


def main(request):
    all_trips = Trip.objects.all()
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
    all_countries = Country.objects.filter(visited=True).order_by("name").values()
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
    mydata = City.objects.values("name", "country__name", "visited").order_by("name")
    template = loader.get_template("cities.html")
    context = {
        "cities": mydata,
    }
    return HttpResponse(template.render(context, request))


def trip_details(request, id):
    trip = Trip.objects.get(id=id)
    template = loader.get_template("trip_details.html")
    context = {"trip": trip, "stops": []}
    return HttpResponse(template.render(context, request))
