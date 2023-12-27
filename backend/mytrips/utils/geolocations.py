from geopy.geocoders import Nominatim


def get_location(city, country, state=""):
    geolocator = Nominatim(user_agent="my-personal-application")
    address = ""
    if city:
        address = city
    if state:
        address = f"{address}, {state}"
    address = f"{address}, {country}"

    location = geolocator.geocode(
        address,
        addressdetails=True,
        exactly_one=True,
        language="en",
        timeout=30,
    )
    if location and location.raw:
        return {
            "lat": float(location.raw["lat"]),
            "lon": float(location.raw["lon"]),
            "city": location.raw["name"],
            "country": location.raw["address"]["country"],
        }
