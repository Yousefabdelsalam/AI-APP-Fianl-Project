from sqlalchemy import Column, Integer, String, Float, Text, JSON, DateTime
from sqlalchemy.sql import func
from ..database import Base

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), index=True, nullable=False)
    country = Column(String(100), index=True, nullable=False)
    city = Column(String(100), index=True)
    description = Column(Text)
    category = Column(String(50), index=True) # e.g., 'beach', 'mountain', 'historic'
    best_season = Column(String(50))
    average_cost = Column(Float)
    image_url = Column(String(500))
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    rating = Column(Float, default=0.0)
    tags = Column(JSON, default=[]) # e.g., ["family", "adventure"]
    created_at = Column(DateTime(timezone=True), server_default=func.now())
