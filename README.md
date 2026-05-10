# AI Tourism Guide & Virtual Destination Generator

A premium full-stack AI-powered tourism platform that helps users discover destinations, generate personalized travel plans, chat with an AI travel guide, estimate trip budgets, and explore destinations virtually.

## Features
- **AI Travel Chatbot**: Professional travel consultancy.
- **Trip Planner**: Day-by-day itineraries with cost estimates.
- **Budget Estimator**: Visual financial breakdown for trips.
- **Virtual Generator**: AI-powered destination visualization.
- **Explorer**: Search and filter global destinations.
- **Admin Dashboard**: System analytics and management.
- **Premium UI**: Modern glassmorphism design with Framer Motion.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL (SQLite for local dev), Pydantic.
- **AI**: Groq (Llama 3.3 70B), LangChain.

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`.
3. Activate it: `.\venv\Scripts\activate`.
4. Install dependencies: `pip install -r requirements.txt`.
5. Create a `.env` file (see below).
6. Run migrations: `alembic upgrade head`.
7. Start the server: `uvicorn app.main:app --reload`.

### 2. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.

## Environment Variables

### Backend (.env)
```env
JWT_SECRET_KEY="your_secret_key"
ALGORITHM="HS256"
DATABASE_URL="sqlite:///./tourism.db"
GROQ_API_KEY="your_groq_api_key"
WEATHER_API_KEY="your_openweathermap_key"
```

## Admin Credentials (Seeded)
- **Email**: `admin@tourism.com`
- **Password**: `admin123`

proud to collaborate with @[Nada Ellakany](https://github.com/Nada-Ellakany) on this project.
Great teamwork, creativity, and late-night debugging sessions


