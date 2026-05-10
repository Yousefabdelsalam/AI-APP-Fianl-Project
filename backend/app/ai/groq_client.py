"""
Groq LLM client – shared across all AI service modules.
"""
import json
from groq import Groq
from app.config import settings

def get_groq_client() -> Groq:
    return Groq(api_key=settings.GROQ_API_KEY)

def ask_groq(system_prompt: str, user_prompt: str, json_mode: bool = True) -> str:
    """Send a prompt to Groq and return the response text."""
    client = get_groq_client()
    kwargs = {}
    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}

    chat = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.7,
        max_tokens=4096,
        **kwargs,
    )
    return chat.choices[0].message.content

def parse_json_response(text: str) -> dict:
    """Safely parse JSON from the LLM response."""
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to extract JSON from markdown code blocks
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
        return json.loads(text.strip())
