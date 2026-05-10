from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from app.database import get_db
from app.models import Destination
from app.schemas.destination import DestinationCreate, DestinationUpdate, DestinationResponse
from app.auth.deps import get_current_admin

router = APIRouter()

@router.get("/", response_model=List[DestinationResponse])
def list_destinations(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    """List all destinations with pagination."""
    return db.query(Destination).offset(skip).limit(limit).all()

@router.get("/search", response_model=List[DestinationResponse])
def search_destinations(
    query: Optional[str] = "",
    country: Optional[str] = None,
    category: Optional[str] = None,
    budget: Optional[float] = None,
    db: Session = Depends(get_db),
):
    """Search destinations by name, country, category, or budget."""
    q = db.query(Destination)
    if query:
        q = q.filter(Destination.name.ilike(f"%{query}%"))
    if country:
        q = q.filter(Destination.country.ilike(f"%{country}%"))
    if category:
        q = q.filter(Destination.category == category)
    if budget:
        q = q.filter(Destination.average_cost <= budget)
    return q.limit(50).all()

@router.get("/{destination_id}", response_model=DestinationResponse)
def get_destination(destination_id: int, db: Session = Depends(get_db)):
    """Get a single destination by ID."""
    dest = db.query(Destination).filter(Destination.id == destination_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    return dest

@router.post("/", response_model=DestinationResponse, status_code=201)
def create_destination(dest_in: DestinationCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """Create a new destination (admin only)."""
    dest = Destination(**dest_in.model_dump())
    db.add(dest)
    db.commit()
    db.refresh(dest)
    return dest

@router.put("/{destination_id}", response_model=DestinationResponse)
def update_destination(destination_id: int, dest_in: DestinationUpdate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """Update a destination (admin only)."""
    dest = db.query(Destination).filter(Destination.id == destination_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    for field, value in dest_in.model_dump(exclude_unset=True).items():
        setattr(dest, field, value)
    db.commit()
    db.refresh(dest)
    return dest

@router.delete("/{destination_id}")
def delete_destination(destination_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    """Delete a destination (admin only)."""
    dest = db.query(Destination).filter(Destination.id == destination_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    db.delete(dest)
    db.commit()
    return {"detail": "Destination deleted"}
