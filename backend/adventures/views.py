import os
import requests
from urllib.parse import quote_plus
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SavedAdventure
from .serializers import SavedAdventureSerializer
from datetime import datetime, timedelta, timezone


class SavedAdventureViewSet(viewsets.ModelViewSet):
    serializer_class = SavedAdventureSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavedAdventure.objects.filter(user=self.request.user).order_by("-saved_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


def simplify_category(category_list, title=""):
    text = ",".join(category_list).lower() + " " + title.lower()

    if "trail" in text or "hiking" in text or "path" in text:
        return "Trail"
    if "park" in text:
        return "Park"
    if "museum" in text:
        return "Museum"
    if "theatre" in text or "theater" in text:
        return "Theater"
    if "shop" in text or "mall" in text:
        return "Shopping"
    if "zoo" in text:
        return "Zoo"
    if "aquarium" in text:
        return "Aquarium"
    if "concert" in text or "music" in text:
        return "Concert"
    if "event" in text or "festival" in text:
        return "Event"
    if "sport" in text or "stadium" in text:
        return "Sports"

    return "Adventure"


def get_icon(category):
    if category == "Trail":
        return "🥾"
    if category == "Park":
        return "🌳"
    if category == "Concert":
        return "🎵"
    if category == "Event":
        return "🎉"
    if category == "Sports":
        return "🏟️"
    return "📍"


def get_map_image(lon, lat, api_key):
    return (
        "https://maps.geoapify.com/v1/staticmap"
        f"?style=osm-carto"
        f"&width=600"
        f"&height=300"
        f"&center=lonlat:{lon},{lat}"
        f"&zoom=15"
        f"&marker=lonlat:{lon},{lat};color:%23b79c6a;size:medium"
        f"&apiKey={api_key}"
    )


def get_place_link(place_props, title, city):
    website = place_props.get("website", "")
    url = place_props.get("url", "")
    wiki = place_props.get("wiki", "")

    if website:
        return website
    if url:
        return url
    if wiki:
        return wiki

    search_text = quote_plus(f"{title} {city}")
    return f"https://www.google.com/search?q={search_text}"


def get_geoapify_results(city, api_key):
    try:
        geocode_response = requests.get(
            "https://api.geoapify.com/v1/geocode/search",
            params={
                "text": city,
                "limit": 1,
                "apiKey": api_key,
            },
            timeout=5
        )

        geocode_data = geocode_response.json()
        features = geocode_data.get("features", [])

        if len(features) == 0:
            return []

        props = features[0].get("properties", {})
        lat = props.get("lat")
        lon = props.get("lon")

        if lat is None or lon is None:
            return []

        places_response = requests.get(
            "https://api.geoapify.com/v2/places",
            params={
                "categories": "tourism.sights,leisure.park",
                "filter": f"circle:{lon},{lat},10000",
                "limit": 8,
                "apiKey": api_key,
            },
            timeout=10
        )

        places_data = places_response.json()
        results = []

        for place in places_data.get("features", []):
            place_props = place.get("properties", {})
            geometry = place.get("geometry", {})
            coordinates = geometry.get("coordinates", [])

            place_lon = None
            place_lat = None

            if len(coordinates) == 2:
                place_lon = coordinates[0]
                place_lat = coordinates[1]

            title = place_props.get("name", "No name")
            category = simplify_category(place_props.get("categories", []), title)

            image_url = ""
            if place_lat is not None and place_lon is not None:
                image_url = get_map_image(place_lon, place_lat, api_key)

            website_url = get_place_link(place_props, title, city)

            results.append({
                "title": title,
                "city": city,
                "address": place_props.get("formatted", ""),
                "category": category,
                "description": place_props.get("formatted", ""),
                "google_place_id": place_props.get("place_id", ""),
                "image_url": image_url,
                "website_url": website_url,
                "icon": get_icon(category)
            })

        return results

    except Exception as error:
        print("GEOAPIFY ERROR:", error)
        return []

        places_response = requests.get(
            "https://api.geoapify.com/v2/places",
            params={
                "categories": "tourism.sights,leisure.park",
                "filter": f"circle:{lon},{lat},10000",
                "limit": 10,
                "apiKey": api_key,
            },
            timeout=12
        )

        places_data = places_response.json()
        print("PLACES DATA:", places_data)

        results = []

        for place in places_data.get("features", []):
            place_props = place.get("properties", {})
            geometry = place.get("geometry", {})
            coordinates = geometry.get("coordinates", [])

            place_lon = None
            place_lat = None

            if len(coordinates) == 2:
                place_lon = coordinates[0]
                place_lat = coordinates[1]

            title = place_props.get("name", "No name")
            category = simplify_category(place_props.get("categories", []), title)

            image_url = ""
            if place_lat is not None and place_lon is not None:
                image_url = get_map_image(place_lon, place_lat, api_key)

            website_url = get_place_link(place_props, title, city)

            results.append({
                "title": title,
                "city": city,
                "address": place_props.get("formatted", ""),
                "category": category,
                "description": place_props.get("formatted", ""),
                "google_place_id": place_props.get("place_id", ""),
                "image_url": image_url,
                "website_url": website_url,
                "icon": get_icon(category)
            })

        print("GEOAPIFY RESULTS COUNT:", len(results))
        return results

    except Exception as error:
        print("GEOAPIFY ERROR:", error)
        return []


def get_ticketmaster_results(city, api_key):
    if not api_key:
        return []

    try:
        now = datetime.now(timezone.utc)
        end_time = now + timedelta(hours=48)

        response = requests.get(
            "https://app.ticketmaster.com/discovery/v2/events.json",
            params={
                "city": city,
                "size": 10,
                "apikey": api_key,
                "startDateTime": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "endDateTime": end_time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "sort": "date,asc",
            },
            timeout=5
        )

        data = response.json()
        events = data.get("_embedded", {}).get("events", [])
        results = []

        for event in events:
            title = event.get("name", "No name")
            website_url = event.get("url", "")

            image_url = ""
            images = event.get("images", [])
            if len(images) > 0:
                image_url = images[0].get("url", "")

            category = "Event"

            classifications = event.get("classifications", [])
            if len(classifications) > 0:
                segment = classifications[0].get("segment", {}).get("name", "").lower()
                genre = classifications[0].get("genre", {}).get("name", "").lower()
                text = segment + " " + genre

                if "music" in text:
                    category = "Concert"
                elif "sports" in text:
                    category = "Sports"

            address = ""
            venues = event.get("_embedded", {}).get("venues", [])
            if len(venues) > 0:
                address = venues[0].get("name", "")

            results.append({
                "title": title,
                "city": city,
                "address": address,
                "category": category,
                "description": address,
                "google_place_id": event.get("id", ""),
                "image_url": image_url,
                "website_url": website_url,
                "icon": get_icon(category)
            })

        print("TICKETMASTER RESULTS COUNT:", len(results))
        return results

    except Exception as error:
        print("TICKETMASTER ERROR:", error)
        return []


class SearchAdventureView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        city = request.GET.get("city", "").strip()

        if city == "":
            return Response([])

        geoapify_api_key = os.getenv("GEOAPIFY_API_KEY")
        ticketmaster_api_key = os.getenv("TICKETMASTER_API_KEY")

        geoapify_results = []
        ticketmaster_results = []

        if geoapify_api_key:
            geoapify_results = get_geoapify_results(city, geoapify_api_key)

        if ticketmaster_api_key:
            ticketmaster_results = get_ticketmaster_results(city, ticketmaster_api_key)

        all_results = geoapify_results + ticketmaster_results
        print("TOTAL RESULTS:", len(all_results))

        return Response(all_results)