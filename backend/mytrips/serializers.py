from rest_framework import serializers
from .models import City, Plan, Stop, Trip, Country


class StatsSerializer(serializers.Serializer):
    countries = serializers.IntegerField()
    cities = serializers.IntegerField()
    trips = serializers.IntegerField()
    continents = serializers.IntegerField()
    total_duration = serializers.IntegerField()


class TripsSerializer(serializers.ModelSerializer):
    duration = serializers.ReadOnlyField()
    countries = serializers.ReadOnlyField()

    class Meta:
        model = Trip
        fields = "__all__"


class TripSerializer(serializers.ModelSerializer):

    class Meta:
        model = Trip
        fields = "__all__"


class CountriesSerializer(serializers.ModelSerializer):
    visits = serializers.IntegerField()

    class Meta:
        model = Country
        fields = ["id", "name", "continent", "visits", "iso_code"]


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = "__all__"


class CitiesSerializer(serializers.ModelSerializer):
    visits = serializers.ReadOnlyField()
    last_visit = serializers.ReadOnlyField()
    country = serializers.CharField(source="country__name")

    class Meta:
        model = City
        fields = ["id", "name", "country", "visits", "last_visit", "visited"]


class CitySerializer(serializers.ModelSerializer):
    visits = serializers.ReadOnlyField()
    last_visit = serializers.ReadOnlyField()
    # country = serializers.CharField(source="country__name")

    class Meta:
        model = City
        fields = "__all__"


class StopsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Stop
        fields = "__all__"


class StopSerializer(serializers.ModelSerializer):
    city = serializers.CharField(source="city__name")
    country = serializers.CharField(source="city__country__name")
    trip = serializers.CharField(source="trip__title")

    class Meta:
        model = Stop
        fields = "__all__"


class PlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plan
        fields = "__all__"
