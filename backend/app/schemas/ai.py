from pydantic import BaseModel
from typing import Optional, List, Any

# ── Recommendation ──
class RecommendationRequest(BaseModel):
    country_preference: Optional[str] = ""
    budget: Optional[str] = ""
    travel_style: Optional[str] = ""
    duration_days: int = 5
    interests: List[str] = []

class RecommendationResponse(BaseModel):
    recommended_destinations: List[Any]
    reason: str
    best_choice: str

# ── Trip Planner ──
class DayPlan(BaseModel):
    day: int
    morning: str
    afternoon: str
    evening: str
    estimated_cost: float = 0

class TripPlannerRequest(BaseModel):
    destination: str
    duration_days: int = 7
    budget: float = 1500
    travel_style: Optional[str] = "cultural"
    interests: List[str] = []

class TripPlannerResponse(BaseModel):
    id: Optional[int] = None
    title: str
    summary: str
    daily_plan: List[DayPlan]
    total_estimated_cost: float
    tips: List[str]

# ── Chat ──
class ChatRequest(BaseModel):
    message: str
    user_context: Optional[dict] = {}

class ChatResponse(BaseModel):
    response: str
    suggestions: List[str] = []

# ── Virtual Destination ──
class VirtualDestinationRequest(BaseModel):
    destination: str
    style: Optional[str] = "realistic"
    time_of_day: Optional[str] = "day"
    description: Optional[str] = ""

class VirtualDestinationResponse(BaseModel):
    image_url: str
    prompt_used: str

# ── Budget ──
class BudgetRequest(BaseModel):
    destination: str
    duration_days: int = 5
    hotel_type: Optional[str] = "medium"
    food_style: Optional[str] = "local"
    activities_level: Optional[str] = "medium"

class BudgetResponse(BaseModel):
    hotel_cost: float
    food_cost: float
    transport_cost: float
    activities_cost: float
    total_cost: float
    saving_tips: List[str]
