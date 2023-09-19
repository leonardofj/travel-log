from django.db import models

from mytrips.utils.choices import CONTINENTS, CURRENCIES, LANGUAGES


class Country(models.Model):
    name = models.CharField(max_length=255, unique=True)
    visited = models.BooleanField(default=False)
    need_visa = models.BooleanField(default=None, null=True)
    lat = models.DecimalField(max_digits=9, decimal_places=6)
    lon = models.DecimalField(max_digits=9, decimal_places=6)
    continent = models.CharField(max_length=25, choices=CONTINENTS, null=True)
    capital = models.CharField(max_length=255, null=True)
    currency = models.CharField(max_length=25, choices=CURRENCIES, null=True)
    language = models.CharField(max_length=25, choices=LANGUAGES, null=True)
    area_code = models.CharField(max_length=10, null=True)

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
    state = models.CharField(max_length=255, null=True)

    class Meta:
        verbose_name_plural = "Cities"

    def __str__(self):
        return self.name


class Stop(models.Model):
    arrival = models.DateTimeField(default=None, null=True)
    departure = models.DateTimeField(default=None, null=True)
    city = models.ForeignKey(
        "City",
        on_delete=models.CASCADE,
    )
    trip = models.ForeignKey(
        "Trip",
        on_delete=models.CASCADE,
    )


class Trip(models.Model):
    title = models.CharField(max_length=255)
    duration = models.PositiveIntegerField(null=True)

    def __str__(self):
        return self.title
