from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional

from database import cursor, db
from security import hash_password, verify_password, create_token
from deps import get_current_user

router = APIRouter(tags=["auth"])


class Register(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    graduation_year: Optional[str] = None
    current_organization: Optional[str] = None
    current_role: Optional[str] = None
    department: Optional[str] = None
    batch: Optional[str] = None


class Login(BaseModel):
    email: EmailStr
    password: str


def _user_row_to_dict(row: dict) -> dict:
    if not row:
        return None
    return {
        "id": str(row["id"]),
        "name": row["name"],
        "email": row["email"],
        "role": row["role"],
        "graduation_year": row.get("graduation_year"),
        "current_organization": row.get("current_organization"),
        "current_role": row.get("current_role"),
        "department": row.get("department"),
        "batch": row.get("batch"),
        "phone": row.get("phone"),
        "location": row.get("location"),
        "bio": row.get("bio"),
        "linkedin": row.get("linkedin"),
        "avatar": row.get("avatar"),
    }


@router.post("/register")
def register(data: Register):
    cursor.execute("SELECT id FROM users WHERE email = %s", (data.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="User already exists")

    is_approved = 1 if data.role in ("student", "admin") else 0

    cursor.execute(
        """INSERT INTO users (name, email, password, role, is_approved,
           graduation_year, current_organization, current_role, department, batch)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
        (
            data.name,
            data.email,
            hash_password(data.password),
            data.role,
            is_approved,
            data.graduation_year,
            data.current_organization,
            data.current_role,
            data.department,
            data.batch,
        ),
    )
    db.commit()
    user_id = cursor.lastrowid
    cursor.execute(
        "SELECT id, name, email, role, graduation_year, current_organization, current_role, department, batch, phone, location, bio, linkedin, avatar FROM users WHERE id = %s",
        (user_id,),
    )
    user = cursor.fetchone()
    return {
        "message": "Registered successfully",
        "approvalRequired": not is_approved,
        "user": _user_row_to_dict(user),
        "access_token": create_token({"email": data.email, "role": data.role}),
    }


@router.post("/login")
def login(data: Login):
    cursor.execute(
        "SELECT id, name, email, password, role, is_approved, graduation_year, current_organization, current_role, department, batch, phone, location, bio, linkedin, avatar FROM users WHERE email = %s",
        (data.email,),
    )
    user = cursor.fetchone()

    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user["role"] == "alumni" and not user["is_approved"]:
        raise HTTPException(status_code=403, detail="Alumni approval pending")

    token = create_token({"email": user["email"], "role": user["role"]})
    out = {
        "id": str(user["id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "graduation_year": user.get("graduation_year"),
        "current_organization": user.get("current_organization"),
        "current_role": user.get("current_role"),
        "department": user.get("department"),
        "batch": user.get("batch"),
        "phone": user.get("phone"),
        "location": user.get("location"),
        "bio": user.get("bio"),
        "linkedin": user.get("linkedin"),
        "avatar": user.get("avatar"),
    }
    return {"access_token": token, "role": user["role"], "user": out}


@router.get("/me", response_model=dict)
def me(current_user: dict = Depends(get_current_user)):
    return _user_row_to_dict(current_user)
