from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class TripPlan(Base):
    __tablename__ = "trip_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    destination = Column(String(100), nullable=False)
    duration_days = Column(Integer, nullable=False)
    budget = Column(Float, nullable=False)
    travel_style = Column(String(50))
    generated_plan = Column(JSON, nullable=False) # Store the full AI generated plan here
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")

class SavedTrip(Base):
    __tablename__ = "saved_trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    trip_plan_id = Column(Integer, ForeignKey("trip_plans.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    trip_plan = relationship("TripPlan")
