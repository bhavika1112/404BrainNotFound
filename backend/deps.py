"""Dependencies: JWT auth and current user."""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os

from security import ALGORITHM
from database import cursor

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
bearer = HTTPBearer(auto_error=False)


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> int:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    cursor.execute("SELECT id, name, email, role, is_approved FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if user.get("role") == "alumni" and not user.get("is_approved"):
        raise HTTPException(status_code=403, detail="Alumni approval pending")
    return user["id"]


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> dict:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    cursor.execute(
        "SELECT id, name, email, role, is_approved, graduation_year, current_organization, "
        "current_role, department, batch, phone, location, bio, linkedin, avatar, created_at "
        "FROM users WHERE email = %s",
        (email,),
    )
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if user.get("role") == "alumni" and not user.get("is_approved"):
        raise HTTPException(status_code=403, detail="Alumni approval pending")
    return user


def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return current_user
