from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class TripPlanCreate(BaseModel):
    title: str
    destination: str
    duration_days: int
    budget: float
    travel_style: Optional[str] = None
    generated_plan: Any  # JSON of the AI-generated plan

class TripPlanResponse(BaseModel):
    id: int
    user_id: int
    title: str
    destination: str
    duration_days: int
    budget: float
    travel_style: Optional[str] = None
    generated_plan: Any
    created_at: datetime

    class Config:
        from_attributes = True

class SavedTripResponse(BaseModel):
    id: int
    user_id: int
    trip_plan_id: int
    created_at: datetime
    trip_plan: Optional[TripPlanResponse] = None

    class Config:
        from_attributes = True
