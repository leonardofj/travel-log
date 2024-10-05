from rest_framework import serializers
from .utils.choices import CURRENCIES, LANGUAGES
from .models import City, Plan, Stop, Tag, Trip, Country


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
    language = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()

    class Meta:
        model = Country
        fields = "__all__"

    def get_language(self, obj):
        languages_dict = dict(LANGUAGES)
        return languages_dict.get(obj.language, obj.language)

    def get_currency(self, obj):
        currencies_dict = dict(CURRENCIES)
        return f"{currencies_dict.get(obj.currency, obj.currency)} ({obj.currency})"


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
    country = serializers.CharField(source="country__name")
    state = serializers.CharField(allow_blank=True)

    class Meta:
        model = City
        fields = "__all__"


class StopsSerializer(serializers.ModelSerializer):
    city = serializers.CharField(source="city__name")
    country = serializers.CharField(source="city__country__name")
    trip = serializers.CharField(source="trip__title")

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


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = "__all__"
