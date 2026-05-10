from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import TripPlan, SavedTrip
from app.schemas.trip import TripPlanResponse, SavedTripResponse
from app.auth.deps import get_current_user
from app.models import User

router = APIRouter()

@router.post("/save/{trip_id}", response_model=SavedTripResponse)
def save_trip(trip_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Save a trip plan to the user's saved trips."""
    trip = db.query(TripPlan).filter(TripPlan.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip plan not found")

    existing = db.query(SavedTrip).filter(
        SavedTrip.user_id == user.id, SavedTrip.trip_plan_id == trip_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Trip already saved")

    saved = SavedTrip(user_id=user.id, trip_plan_id=trip_id)
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return saved

@router.get("/my-trips", response_model=List[SavedTripResponse])
def get_my_trips(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Get all saved trips for the current user."""
    saved = db.query(SavedTrip).filter(SavedTrip.user_id == user.id).all()
    return saved

@router.get("/my-plans", response_model=List[TripPlanResponse])
def get_my_plans(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Get all generated trip plans for the current user."""
    plans = db.query(TripPlan).filter(TripPlan.user_id == user.id).order_by(TripPlan.created_at.desc()).all()
    return plans

@router.delete("/{trip_id}")
def delete_saved_trip(trip_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Remove a saved trip."""
    saved = db.query(SavedTrip).filter(SavedTrip.id == trip_id, SavedTrip.user_id == user.id).first()
    if not saved:
        raise HTTPException(status_code=404, detail="Saved trip not found")
    db.delete(saved)
    db.commit()
    return {"detail": "Saved trip removed"}
