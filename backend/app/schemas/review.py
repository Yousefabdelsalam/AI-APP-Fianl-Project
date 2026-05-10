from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReviewCreate(BaseModel):
    destination_id: int
    rating: float
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    user_id: int
    destination_id: int
    rating: float
    comment: Optional[str] = None
    created_at: datetime
    user_name: Optional[str] = None  # populated in route

    class Config:
        from_attributes = True
