"""AI Trip Planner Service – Generate day-by-day travel itineraries."""
from app.ai.groq_client import ask_groq, parse_json_response

SYSTEM_PROMPT = """You are a professional trip planner AI. Given a destination, duration, budget, travel style, and interests, generate a detailed day-by-day travel plan.

Rules:
- Be realistic about costs and timing
- Include morning, afternoon, and evening activities
- Suggest real places and attractions (don't invent fake ones)
- Consider the budget constraints
- Provide estimated costs for each day
- Include practical tips
- Consider weather and best times to visit

Return your response as JSON with this exact structure:
{
  "title": "Trip title",
  "summary": "Brief overview of the trip",
  "daily_plan": [
    {
      "day": 1,
      "morning": "Morning activity description",
      "afternoon": "Afternoon activity description",
      "evening": "Evening activity description",
      "estimated_cost": 150
    }
  ],
  "total_estimated_cost": 1000,
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}
"""

def generate_trip_plan(destination: str, duration_days: int, budget: float, travel_style: str, interests: list) -> dict:
    """Generate a complete trip plan using AI."""
    user_prompt = f"""Plan a trip with the following details:
- Destination: {destination}
- Duration: {duration_days} days
- Budget: ${budget} USD total
- Travel Style: {travel_style}
- Interests: {', '.join(interests) if interests else 'general sightseeing'}

Generate a detailed day-by-day itinerary."""

    raw = ask_groq(SYSTEM_PROMPT, user_prompt, json_mode=True)
    return parse_json_response(raw)
