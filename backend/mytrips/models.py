from django.db import models

from mytrips.utils.choices import CONTINENTS, CURRENCIES, LANGUAGES


class Country(models.Model):
    name = models.CharField(max_length=255, unique=True)
    visited = models.BooleanField(default=False)
    need_visa = models.BooleanField(default=None, null=True)
    visa_detail = models.CharField(max_length=255, default=None, null=True, blank=True)
    lat = models.DecimalField(max_digits=9, decimal_places=6)
    lon = models.DecimalField(max_digits=9, decimal_places=6)
    continent = models.CharField(max_length=25, choices=CONTINENTS, null=True)
    capital = models.CharField(max_length=255, null=True, default=None)
    currency = models.CharField(
        max_length=25, choices=CURRENCIES, null=True, default=None
    )
    language = models.CharField(
        max_length=25, choices=LANGUAGES, null=True, default=None
    )
    area_code = models.CharField(max_length=10, null=True, default=None)
    iso_code = models.CharField(max_length=10)

    class Meta:
        verbose_name_plural = "Countries"

    def __str__(self):
        return self.name


class City(models.Model):
    name = models.CharField(max_length=255)
    visited = models.BooleanField(default=False)
    country = models.ForeignKey(
        "Country",
        on_delete=models.CASCADE,
    )
    lat = models.DecimalField(max_digits=9, decimal_places=6)
    lon = models.DecimalField(max_digits=9, decimal_places=6)
    state = models.CharField(max_length=255, null=True, default=None)

    class Meta:
        verbose_name_plural = "Cities"
        constraints = [
            models.UniqueConstraint(
                fields=["name", "country"], name="unique_city_country"
            ),
        ]

    def __str__(self):
        return self.name


class Stop(models.Model):
    arrival = models.DateTimeField(null=True)
    departure = models.DateTimeField(null=True)
    city = models.ForeignKey(
        "City",
        on_delete=models.CASCADE,
    )
    trip = models.ForeignKey(
        "Trip", on_delete=models.DO_NOTHING, null=True, default=None
    )


class Trip(models.Model):
    title = models.CharField(max_length=255)
    start = models.DateField(null=True)
    end = models.DateField(null=True)

    def __str__(self):
        return self.title

    @property
    def duration(self):
        duration = self.end - self.start
        return duration.days + 1

    @property
    def countries(self):
        trip_countries = (
            Stop.objects.filter(trip=self)
            .order_by("arrival")
            .values("city__country__iso_code")
        )
        return list({x["city__country__iso_code"] for x in trip_countries})


class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Plan(models.Model):
    title = models.CharField(max_length=255)
    start = models.DateField(null=True)
    end = models.DateField(null=True)
    tags = models.ManyToManyField(Tag, blank=True)
    cities = models.ManyToManyField(City, blank=True)

    def __str__(self):
        return self.title

    @property
    def duration(self):
        duration = self.end - self.start
        return duration.days + 1


class PackingItem(models.Model):
    name = models.CharField(max_length=50)
    quantity_modifier = models.IntegerField(default=1)
    single = models.BooleanField(default=True)
    tags = models.ManyToManyField(Tag, blank=True)
    all_trips = models.BooleanField(default=False)

    def __str__(self):
        return self.name
