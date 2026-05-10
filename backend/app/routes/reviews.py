from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Review, User
from app.schemas.review import ReviewCreate, ReviewResponse
from app.auth.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=ReviewResponse, status_code=201)
def create_review(review_in: ReviewCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Create a review for a destination."""
    review = Review(
        user_id=user.id,
        destination_id=review_in.destination_id,
        rating=review_in.rating,
        comment=review_in.comment,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return ReviewResponse(
        id=review.id,
        user_id=review.user_id,
        destination_id=review.destination_id,
        rating=review.rating,
        comment=review.comment,
        created_at=review.created_at,
        user_name=user.full_name,
    )

@router.get("/destination/{destination_id}", response_model=List[ReviewResponse])
def get_reviews(destination_id: int, db: Session = Depends(get_db)):
    """Get all reviews for a destination."""
    reviews = db.query(Review).filter(Review.destination_id == destination_id).order_by(Review.created_at.desc()).all()
    result = []
    for r in reviews:
        user = db.query(User).filter(User.id == r.user_id).first()
        result.append(ReviewResponse(
            id=r.id,
            user_id=r.user_id,
            destination_id=r.destination_id,
            rating=r.rating,
            comment=r.comment,
            created_at=r.created_at,
            user_name=user.full_name if user else "Anonymous",
        ))
    return result

@router.delete("/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Delete a review (owner only)."""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(review)
    db.commit()
    return {"detail": "Review deleted"}
