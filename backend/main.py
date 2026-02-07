from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD

from auth import router as auth_router
from routers import users, jobs, events, donations, mentorship, applications, messages

app = FastAPI(
    title="Smart Alumni Connect API",
    description="Alumni engagement platform: registration, networking, jobs, events, donations, mentorship.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"],
=======
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database configuration
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={{"check_same_thread": False}})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Create FastAPI instance
app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
>>>>>>> 19ba7efd8ff9a9b742326274a4c48ecf8ab248d6
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
app.include_router(auth_router)
app.include_router(users.router)
app.include_router(jobs.router)
app.include_router(events.router)
app.include_router(donations.router)
app.include_router(mentorship.router)
app.include_router(applications.router)
app.include_router(messages.router)


@app.get("/")
def root():
    return {"message": "Smart Alumni Connect API", "docs": "/docs"}
=======
# Include routes
# from .routes import router as api_router
# app.include_router(api_router)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI application!"}
>>>>>>> 19ba7efd8ff9a9b742326274a4c48ecf8ab248d6
