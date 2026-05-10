from fastapi import APIRouter
import httpx
from app.config import settings

router = APIRouter()

@router.get("/")
async def get_weather(city: str):
    """Get weather data for a city using OpenWeatherMap API."""
    if not settings.WEATHER_API_KEY or settings.WEATHER_API_KEY == "your-weather-api-key-here":
        # Return mock weather data if no API key is configured
        return {
            "city": city,
            "temperature": 25,
            "feels_like": 27,
            "description": "Partly cloudy",
            "humidity": 60,
            "wind_speed": 12,
            "icon": "02d",
            "mock": True,
        }

    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={settings.WEATHER_API_KEY}&units=metric"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        if resp.status_code != 200:
            return {"city": city, "error": "Could not fetch weather data"}
        data = resp.json()
        return {
            "city": city,
            "temperature": data["main"]["temp"],
            "feels_like": data["main"]["feels_like"],
            "description": data["weather"][0]["description"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"],
            "icon": data["weather"][0]["icon"],
        }
