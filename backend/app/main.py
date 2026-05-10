from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User, Destination
from app.utils.security import get_password_hash
from app.routes import (
    auth_router,
    destinations_router,
    ai_router,
    trips_router,
    reviews_router,
    admin_router,
    weather_router,
)

# Create tables (for SQLite quick dev – Alembic handles Postgres)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──
prefix = settings.API_V1_STR
app.include_router(auth_router,         prefix=f"{prefix}/auth",         tags=["Authentication"])
app.include_router(destinations_router,  prefix=f"{prefix}/destinations", tags=["Destinations"])
app.include_router(ai_router,           prefix=f"{prefix}/ai",           tags=["AI Services"])
app.include_router(trips_router,        prefix=f"{prefix}/trips",        tags=["Trips"])
app.include_router(reviews_router,      prefix=f"{prefix}/reviews",      tags=["Reviews"])
app.include_router(admin_router,        prefix=f"{prefix}/admin",        tags=["Admin"])
app.include_router(weather_router,      prefix=f"{prefix}/weather",      tags=["Weather"])

@app.get("/")
def root():
    return {"message": "Welcome to the AI Tourism Guide API", "docs": "/docs"}

# ── Seed Data ──
@app.on_event("startup")
def seed_database():
    """Seed the database with initial destinations and an admin user."""
    db = SessionLocal()
    try:
        # Create admin user if not exists
        admin = db.query(User).filter(User.email == "admin@tourism.com").first()
        if not admin:
            admin = User(
                full_name="Admin User",
                email="admin@tourism.com",
                hashed_password=get_password_hash("admin123"),
                role="admin",
            )
            db.add(admin)

        # Seed destinations if empty
        if db.query(Destination).count() == 0:
            destinations = [
                Destination(
                    name="Eiffel Tower",
                    country="France",
                    city="Paris",
                    description="Iconic iron lattice tower on the Champ de Mars, offering panoramic city views and fine dining. A must-visit symbol of French culture and engineering marvel.",
                    category="historic",
                    best_season="Spring",
                    average_cost=1200,
                    image_url="https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=800&q=80",
                    latitude=48.8584,
                    longitude=2.2945,
                    rating=4.8,
                    tags=["romantic", "landmark", "culture"],
                ),
                Destination(
                    name="Santorini",
                    country="Greece",
                    city="Santorini",
                    description="Stunning volcanic island famous for white-washed buildings, blue-domed churches, and breathtaking sunsets over the Aegean Sea.",
                    category="beach",
                    best_season="Summer",
                    average_cost=1500,
                    image_url="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
                    latitude=36.3932,
                    longitude=25.4615,
                    rating=4.9,
                    tags=["romantic", "beach", "island"],
                ),
                Destination(
                    name="Machu Picchu",
                    country="Peru",
                    city="Cusco Region",
                    description="Ancient Incan citadel set high in the Andes Mountains, offering awe-inspiring ruins surrounded by dramatic mountain scenery.",
                    category="historic",
                    best_season="Winter",
                    average_cost=800,
                    image_url="https://images.unsplash.com/photo-1587595431973-160d0d163dad?w=800&q=80",
                    latitude=-13.1631,
                    longitude=-72.5450,
                    rating=4.9,
                    tags=["adventure", "historic", "hiking"],
                ),
                Destination(
                    name="Tokyo",
                    country="Japan",
                    city="Tokyo",
                    description="A dazzling metropolis blending ultramodern technology with traditional temples, world-class cuisine, and vibrant pop culture.",
                    category="urban",
                    best_season="Spring",
                    average_cost=1800,
                    image_url="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
                    latitude=35.6762,
                    longitude=139.6503,
                    rating=4.7,
                    tags=["culture", "food", "technology"],
                ),
                Destination(
                    name="Bali",
                    country="Indonesia",
                    city="Bali",
                    description="Tropical paradise known for stunning rice terraces, ancient temples, vibrant arts scene, and world-class surfing.",
                    category="beach",
                    best_season="Summer",
                    average_cost=600,
                    image_url="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
                    latitude=-8.3405,
                    longitude=115.0920,
                    rating=4.6,
                    tags=["beach", "spiritual", "nature"],
                ),
                Destination(
                    name="Swiss Alps",
                    country="Switzerland",
                    city="Interlaken",
                    description="Majestic mountain landscape with world-class skiing, pristine lakes, charming villages, and thrilling adventure sports.",
                    category="mountain",
                    best_season="Winter",
                    average_cost=2500,
                    image_url="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
                    latitude=46.6863,
                    longitude=7.8632,
                    rating=4.8,
                    tags=["adventure", "skiing", "nature"],
                ),
                Destination(
                    name="Dubai",
                    country="UAE",
                    city="Dubai",
                    description="Futuristic city of superlatives featuring the world's tallest building, luxury shopping, desert safaris, and stunning architecture.",
                    category="urban",
                    best_season="Winter",
                    average_cost=2000,
                    image_url="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
                    latitude=25.2048,
                    longitude=55.2708,
                    rating=4.5,
                    tags=["luxury", "shopping", "modern"],
                ),
                Destination(
                    name="Pyramids of Giza",
                    country="Egypt",
                    city="Cairo",
                    description="Ancient wonder of the world – the Great Pyramids and Sphinx stand as timeless monuments to human achievement.",
                    category="historic",
                    best_season="Winter",
                    average_cost=500,
                    image_url="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80",
                    latitude=29.9792,
                    longitude=31.1342,
                    rating=4.7,
                    tags=["historic", "culture", "wonder"],
                ),
                Destination(
                    name="Maldives",
                    country="Maldives",
                    city="Malé",
                    description="Paradise archipelago of crystal-clear waters, overwater bungalows, vibrant coral reefs, and unparalleled luxury resorts.",
                    category="beach",
                    best_season="Winter",
                    average_cost=3000,
                    image_url="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
                    latitude=3.2028,
                    longitude=73.2207,
                    rating=4.9,
                    tags=["luxury", "beach", "romantic"],
                ),
                Destination(
                    name="New York City",
                    country="USA",
                    city="New York",
                    description="The city that never sleeps – iconic skyline, Broadway shows, Central Park, world-class museums, and diverse cuisine.",
                    category="urban",
                    best_season="Fall",
                    average_cost=2200,
                    image_url="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
                    latitude=40.7128,
                    longitude=-74.0060,
                    rating=4.6,
                    tags=["urban", "culture", "food"],
                ),
                Destination(
                    name="Cape Town",
                    country="South Africa",
                    city="Cape Town",
                    description="Spectacular coastal city with Table Mountain, stunning beaches, vibrant food scene, and rich cultural heritage.",
                    category="beach",
                    best_season="Summer",
                    average_cost=700,
                    image_url="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
                    latitude=-33.9249,
                    longitude=18.4241,
                    rating=4.7,
                    tags=["nature", "beach", "adventure"],
                ),
                Destination(
                    name="Istanbul",
                    country="Turkey",
                    city="Istanbul",
                    description="Where East meets West – a city of grand mosques, bustling bazaars, Byzantine mosaics, and incredible Turkish cuisine.",
                    category="historic",
                    best_season="Spring",
                    average_cost=600,
                    image_url="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
                    latitude=41.0082,
                    longitude=28.9784,
                    rating=4.6,
                    tags=["culture", "food", "historic"],
                ),
            ]
            db.add_all(destinations)

        db.commit()
    finally:
        db.close()
