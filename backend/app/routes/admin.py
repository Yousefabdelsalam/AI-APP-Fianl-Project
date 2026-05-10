from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.database import get_db
from app.models import User, Destination, TripPlan, Review
from app.schemas.user import UserResponse
from app.auth.deps import get_current_admin

router = APIRouter()

@router.get("/dashboard-stats")
def dashboard_stats(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """Get aggregated dashboard statistics."""
    total_users = db.query(func.count(User.id)).scalar()
    total_destinations = db.query(func.count(Destination.id)).scalar()
    total_trips = db.query(func.count(TripPlan.id)).scalar()
    total_reviews = db.query(func.count(Review.id)).scalar()
    return {
        "total_users": total_users,
        "total_destinations": total_destinations,
        "total_trips": total_trips,
        "total_reviews": total_reviews,
    }

@router.get("/users", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """List all users (admin only)."""
    return db.query(User).all()

@router.get("/trips")
def list_all_trips(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """List all generated trip plans."""
    trips = db.query(TripPlan).order_by(TripPlan.created_at.desc()).limit(100).all()
    return trips

@router.get("/reviews")
def list_all_reviews(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """List all reviews."""
    return db.query(Review).order_by(Review.created_at.desc()).limit(100).all()
