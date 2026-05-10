from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, TripPlan, ChatMessage, VirtualDestination
from app.schemas.ai import (
    RecommendationRequest, RecommendationResponse,
    TripPlannerRequest, TripPlannerResponse,
    ChatRequest, ChatResponse,
    VirtualDestinationRequest, VirtualDestinationResponse,
    BudgetRequest, BudgetResponse,
)
from app.auth.deps import get_current_user
from app.ai.ai_chat_service import chat_with_guide
from app.ai.trip_planner_service import generate_trip_plan
from app.ai.recommendation_service import recommend_destinations
from app.ai.budget_service import estimate_budget
from app.ai.virtual_destination_service import generate_virtual_destination

router = APIRouter()

@router.post("/recommend-destinations", response_model=RecommendationResponse)
def ai_recommend(req: RecommendationRequest, user: User = Depends(get_current_user)):
    """Get AI-powered destination recommendations."""
    try:
        result = recommend_destinations(
            country_preference=req.country_preference,
            budget=req.budget,
            travel_style=req.travel_style,
            duration_days=req.duration_days,
            interests=req.interests,
        )
        return RecommendationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@router.post("/generate-trip-plan", response_model=TripPlannerResponse)
def ai_trip_plan(req: TripPlannerRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Generate a detailed AI trip plan and save it to the database."""
    try:
        result = generate_trip_plan(
            destination=req.destination,
            duration_days=req.duration_days,
            budget=req.budget,
            travel_style=req.travel_style,
            interests=req.interests,
        )

        # Save to database
        trip = TripPlan(
            user_id=user.id,
            title=result.get("title", f"Trip to {req.destination}"),
            destination=req.destination,
            duration_days=req.duration_days,
            budget=req.budget,
            travel_style=req.travel_style,
            generated_plan=result,
        )
        db.add(trip)
        db.commit()
        db.refresh(trip)

        # Attach the trip id so frontend can save it
        result["id"] = trip.id
        return TripPlannerResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@router.post("/chat", response_model=ChatResponse)
def ai_chat(req: ChatRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Chat with the AI travel guide."""
    try:
        result = chat_with_guide(message=req.message, user_context=req.user_context)

        # Save chat message
        chat_msg = ChatMessage(
            user_id=user.id,
            message=req.message,
            response=result.get("response", ""),
        )
        db.add(chat_msg)
        db.commit()

        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@router.post("/generate-virtual-destination", response_model=VirtualDestinationResponse)
def ai_virtual_destination(req: VirtualDestinationRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Generate a virtual destination image."""
    try:
        result = generate_virtual_destination(
            destination=req.destination,
            style=req.style,
            time_of_day=req.time_of_day,
            description=req.description,
        )

        # Save to database
        vd = VirtualDestination(
            user_id=user.id,
            prompt=result.get("prompt_used", ""),
            generated_image_url=result.get("image_url", ""),
            destination_name=req.destination,
        )
        db.add(vd)
        db.commit()

        return VirtualDestinationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@router.post("/estimate-budget", response_model=BudgetResponse)
def ai_estimate_budget(req: BudgetRequest, user: User = Depends(get_current_user)):
    """Estimate travel budget using AI."""
    try:
        result = estimate_budget(
            destination=req.destination,
            duration_days=req.duration_days,
            hotel_type=req.hotel_type,
            food_style=req.food_style,
            activities_level=req.activities_level,
        )
        return BudgetResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
