from datetime import datetime
from django.contrib import messages
from django.db.models import Count, Max
from django.shortcuts import get_object_or_404
from mytrips.serializers import *
from mytrips.utils.geolocations import get_location
from rest_framework import status, viewsets
from rest_framework.response import Response
from .models import City, Country, PackingItem, Plan, Stop, Tag, Trip

HOME = 5  # city_id of home


class StatsViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """

    def list(self, request):
        all_trips = Trip.objects.all()
        travel_stats = {
            "countries": Country.objects.filter(visited=True).count(),
            "cities": City.objects.filter(visited=True).count(),
            "trips": Trip.objects.count(),
            "continents": (
                Country.objects.filter(visited=True)
                .values("continent")
                .distinct()
                .count()
            ),
            "total_duration": sum([item.duration for item in all_trips]),
        }
        serializer = StatsSerializer(travel_stats)
        return Response(serializer.data)


class CountryViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """

    def list(self, request):
        visited = request.query_params.get("visited")
        # TODO: use boolean
        if visited == "false":
            filter = {}
            sort = ["name"]
        else:
            filter = {"visited": True}
            sort = ["-last_visit", "visits"]

        all_countries = (
            Country.objects.filter(**filter)
            .annotate(
                visits=Count("city__stop__trip", distinct=True),
                last_visit=Max("city__stop__trip__end"),
            )
            .order_by(*sort)
        )
        serializer = CountriesSerializer(all_countries, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        country = get_object_or_404(Country, id=pk)
        serializer = CountrySerializer(country)
        return Response(serializer.data)


class TripViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """

    serializer_class = TripSerializer

    def list(self, request):
        country = request.query_params.get("country")
        city = request.query_params.get("city")
        if city:
            filter = {"stop__city__id": city}
        elif country:
            filter = {"stop__city__country__id": country}
        else:
            filter = {}

        all_trips = Trip.objects.filter(**filter).distinct().order_by("-start")
        serializer = TripsSerializer(all_trips, many=True)

        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        trip = get_object_or_404(Trip, id=pk)
        serializer = TripSerializer(trip)
        return Response(serializer.data)


class CityViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """

    serializer_class = CitySerializer

    def list(self, request):
        country = request.query_params.get("country")
        if country:
            filter = {"country__id": country}
        else:
            filter = {}

        cities = (
            City.objects.filter(**filter)
            .annotate(
                visits=Count("stop__trip", distinct=True),
                last_visit=Max("stop__departure"),
            )
            .values("id", "name", "country__name", "visited", "visits", "last_visit")
            .order_by("-id")
        )
        serializer = CitiesSerializer(cities, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        city = get_object_or_404(
            City.objects.annotate(
                visits=Count("stop__trip", distinct=True),
                last_visit=Max("stop__departure"),
            ).values(
                "id",
                "name",
                "country__name",
                "state",
                "visited",
                "visits",
                "last_visit",
                "lat",
                "lon",
            ),
            id=pk,
        )
        serializer = CitySerializer(city)
        return Response(serializer.data)

    def create(self, request):
        data = request.data
        city_name = data["city"]
        state = data.get("state")
        country = get_object_or_404(Country, pk=data["country"])
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
            return Response({}, status=status.HTTP_201_CREATED)
        else:
            messages.error(
                request, f"Coordinates not found for city {city_name} in {country.name}"
            )  # ?
            return Response(
                {
                    "message": f"Coordinates not found for city {city_name} in {country.name}"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class StopViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """

    serializer_class = StopSerializer

    def list(self, request):
        stops = Stop.objects.values(
            "city__country__name", "city__name", "arrival", "departure", "trip__title"
        ).order_by("-departure")
        serializer = StopsSerializer(stops, many=True)
        return Response(serializer.data)

    def create(self, request):
        data = request.data
        stops = data["stops"]
        trip_title = data.get("trip")
        trip_start = datetime.strptime(stops[0]["arrival"], "%Y-%m-%dT%H:%M")
        trip_end = datetime.strptime(stops[-1]["departure"], "%Y-%m-%dT%H:%M")
        last_stop = Stop.objects.order_by("-departure").first().departure.date()

        if trip_title:
            trip_data = {
                "title": trip_title,
                "start": trip_start.date(),
                "end": trip_end.date(),
            }
            trip = Trip(**trip_data)
            trip.save()

        # adding time at home between trips
        if last_stop < trip_start.date():
            home_time = Stop(
                city=get_object_or_404(City, pk=HOME),
                arrival=datetime.fromisoformat(last_stop.isoformat() + " 14:00"),
                departure=trip_start,
            )
            home_time.save()

        # saving stops
        for stop_entry in stops:
            stop_data = {
                "city": get_object_or_404(City, pk=stop_entry["city"]),
                "arrival": datetime.strptime(stop_entry["arrival"], "%Y-%m-%dT%H:%M"),
                "departure": datetime.strptime(
                    stop_entry["departure"], "%Y-%m-%dT%H:%M"
                ),
            }
            if trip_title:
                stop_data["trip"] = trip
            stop = Stop(**stop_data)
            stop.save()

        return Response({}, status=status.HTTP_201_CREATED)


class PlanViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """

    serializer_class = PlanSerializer

    def list(self, request):
        plans = Plan.objects.all()
        serializer = PlanSerializer(plans, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        plan = get_object_or_404(Plan, id=pk)
        serializer = PlanSerializer(plan)
        return Response(serializer.data)

    def create(self, request):
        serializer = PlanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TagViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """

    serializer_class = TagSerializer

    def list(self, request):
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        tag = get_object_or_404(Tag, id=pk)
        serializer = TagSerializer(tag)
        return Response(serializer.data)

    def create(self, request):
        serializer = TagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
