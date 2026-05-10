"""AI Budget Estimator Service – Estimate travel costs."""
from app.ai.groq_client import ask_groq, parse_json_response

SYSTEM_PROMPT = """You are a travel budget expert. Estimate realistic travel costs based on destination, duration, and preferences.

Rules:
- Base estimates on real-world average costs
- Consider the destination's cost of living
- Break down costs by category
- Provide money-saving tips
- Be realistic, don't underestimate

Return your response as EXACTLY this JSON structure:
{
  "hotel_cost": 700,
  "food_cost": 300,
  "transport_cost": 200,
  "activities_cost": 400,
  "total_cost": 1600,
  "saving_tips": [
    "Book accommodation early",
    "Use public transportation"
  ]
}
All costs should be in USD.
"""

def estimate_budget(destination: str, duration_days: int, hotel_type: str, food_style: str, activities_level: str) -> dict:
    """Estimate trip budget using AI."""
    user_prompt = f"""Estimate the travel budget for:
- Destination: {destination}
- Duration: {duration_days} days
- Hotel type: {hotel_type} (budget/medium/luxury)
- Food style: {food_style} (street food/local/fine dining)
- Activities level: {activities_level} (low/medium/high)

Give realistic USD estimates."""

    raw = ask_groq(SYSTEM_PROMPT, user_prompt, json_mode=True)
    data = parse_json_response(raw)

    # Normalize keys — AI sometimes returns "transportation_cost" instead of "transport_cost"
    if "transportation_cost" in data and "transport_cost" not in data:
        data["transport_cost"] = data.pop("transportation_cost")

    # Ensure all required keys exist with safe defaults
    data.setdefault("hotel_cost", 0)
    data.setdefault("food_cost", 0)
    data.setdefault("transport_cost", 0)
    data.setdefault("activities_cost", 0)
    data.setdefault("total_cost",
        data["hotel_cost"] + data["food_cost"] + data["transport_cost"] + data["activities_cost"]
    )
    data.setdefault("saving_tips", [])

    # Remove extra keys that would fail Pydantic validation
    allowed_keys = {"hotel_cost", "food_cost", "transport_cost", "activities_cost", "total_cost", "saving_tips"}
    data = {k: v for k, v in data.items() if k in allowed_keys}

    return data
