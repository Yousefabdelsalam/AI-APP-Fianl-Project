"""AI Recommendation Service – Suggest destinations based on preferences."""
from app.ai.groq_client import ask_groq, parse_json_response

SYSTEM_PROMPT = """You are a destination recommendation expert. Based on user preferences, suggest the best travel destinations.

Rules:
- Suggest real, existing destinations
- Consider budget, travel style, and interests
- Provide reasons for each recommendation
- Rank recommendations by relevance
- Include a mix of popular and hidden-gem destinations

Return your response as JSON with this structure:
{
  "recommended_destinations": [
    {
      "name": "Destination Name",
      "country": "Country",
      "description": "Why this destination is recommended",
      "estimated_cost": 1000,
      "best_season": "Spring"
    }
  ],
  "reason": "Overall reasoning for these recommendations",
  "best_choice": "Name of the top recommended destination"
}
"""

def recommend_destinations(country_preference: str, budget: str, travel_style: str, duration_days: int, interests: list) -> dict:
    """Get AI-powered destination recommendations."""
    user_prompt = f"""Recommend travel destinations based on these preferences:
- Country preference: {country_preference or 'Any'}
- Budget: {budget or 'Flexible'}
- Travel style: {travel_style or 'Any'}
- Duration: {duration_days} days
- Interests: {', '.join(interests) if interests else 'general'}

Suggest 3-5 destinations."""

    raw = ask_groq(SYSTEM_PROMPT, user_prompt, json_mode=True)
    return parse_json_response(raw)
