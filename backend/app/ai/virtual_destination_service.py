"""Virtual Destination Generator Service – Generate AI destination image prompts.

NOTE: This service generates the prompt and returns a generative image URL using Pollinations AI.
"""
import urllib.parse
from app.ai.groq_client import ask_groq, parse_json_response

SYSTEM_PROMPT = """You are a creative visual prompt engineer for travel imagery. 
Given a destination and style preferences, generate a vivid, detailed prompt that could be used with an AI image generator to create a stunning travel scene.

Return your response as JSON with this structure:
{
  "prompt_used": "A highly detailed prompt describing the scene"
}
"""

def generate_virtual_destination(destination: str, style: str, time_of_day: str, description: str) -> dict:
    """Generate a virtual destination image prompt and return a generative image URL."""
    user_prompt = f"""Create a visual prompt for:
- Destination: {destination}
- Style: {style}
- Time of day: {time_of_day}
- Additional description: {description or 'None'}"""

    raw = ask_groq(SYSTEM_PROMPT, user_prompt, json_mode=True)
    data = parse_json_response(raw)
    
    prompt = data.get("prompt_used", f"{destination} in {style} style during {time_of_day}")
    encoded_prompt = urllib.parse.quote(prompt)
    
    # Use Pollinations AI for free, instant GAN/Diffusion generation
    image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=768&nologo=true"

    return {
        "image_url": image_url,
        "prompt_used": prompt,
        "model_type": "Pollinations AI (Generative)"
    }
