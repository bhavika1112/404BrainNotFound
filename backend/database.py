<<<<<<< HEAD
import mysql.connector
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

print("DB_HOST:", DB_HOST)
print("DB_USER:", DB_USER)
print("DB_NAME:", DB_NAME)

db = mysql.connector.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME
)

cursor = db.cursor(dictionary=True)
=======
from sqlalchemy import create_engine, sessionmaker

# SQLAlchemy Database Setup
DATABASE_URL = "sqlite:///./test.db"  # Change for your database
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Session Management
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get DB session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
>>>>>>> 19ba7efd8ff9a9b742326274a4c48ecf8ab248d6
