from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DestinationBase(BaseModel):
    name: str
    country: str
    city: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    best_season: Optional[str] = None
    average_cost: Optional[float] = None
    image_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    rating: Optional[float] = 0.0
    tags: Optional[List[str]] = []

class DestinationCreate(DestinationBase):
    pass

class DestinationUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    best_season: Optional[str] = None
    average_cost: Optional[float] = None
    image_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    rating: Optional[float] = None
    tags: Optional[List[str]] = None

class DestinationResponse(DestinationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
