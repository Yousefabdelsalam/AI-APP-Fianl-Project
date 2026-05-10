from .user import UserBase, UserCreate, UserResponse
from .token import Token, TokenData
from .destination import DestinationBase, DestinationCreate, DestinationUpdate, DestinationResponse
from .trip import TripPlanCreate, TripPlanResponse, SavedTripResponse
from .review import ReviewCreate, ReviewResponse
from .ai import (
    RecommendationRequest, RecommendationResponse,
    TripPlannerRequest, TripPlannerResponse,
    ChatRequest, ChatResponse,
    VirtualDestinationRequest, VirtualDestinationResponse,
    BudgetRequest, BudgetResponse,
)
