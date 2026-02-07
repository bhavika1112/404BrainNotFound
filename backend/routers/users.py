"""Users: profile, list alumni/students, admin approve."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from database import cursor, db
from deps import get_current_user, get_current_user_id, require_admin

router = APIRouter(prefix="/users", tags=["users"])


class UpdateProfile(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    linkedin: Optional[str] = None
    avatar: Optional[str] = None
    graduation_year: Optional[str] = None
    current_organization: Optional[str] = None
    current_role: Optional[str] = None
    department: Optional[str] = None
    batch: Optional[str] = None


def _row_to_user(row: dict) -> dict:
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


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return _row_to_user(current_user)


@router.patch("/me")
def update_me(data: UpdateProfile, user_id: int = Depends(get_current_user_id)):
    updates = data.model_dump(exclude_unset=True)
    if not updates:
        return {"message": "Nothing to update"}
    set_clause = ", ".join(f"{k} = %s" for k in updates)
    values = list(updates.values()) + [user_id]
    cursor.execute(f"UPDATE users SET {set_clause} WHERE id = %s", values)
    db.commit()
    cursor.execute(
        "SELECT id, name, email, role, graduation_year, current_organization, current_role, department, batch, phone, location, bio, linkedin, avatar FROM users WHERE id = %s",
        (user_id,),
    )
    return _row_to_user(cursor.fetchone())


@router.get("/alumni")
def list_alumni(current_user: dict = Depends(get_current_user)):
    cursor.execute(
        "SELECT id, name, email, role, graduation_year, current_organization, current_role, department, batch, phone, location, bio, linkedin, avatar FROM users WHERE role = 'alumni' AND is_approved = 1"
    )
    rows = cursor.fetchall()
    return [_row_to_user(r) for r in rows]


@router.get("/students")
def list_students(current_user: dict = Depends(get_current_user)):
    cursor.execute(
        "SELECT id, name, email, role, graduation_year, current_organization, current_role, department, batch, phone, location, bio, linkedin, avatar FROM users WHERE role = 'student'"
    )
    rows = cursor.fetchall()
    return [_row_to_user(r) for r in rows]


@router.get("/pending")
def list_pending_alumni(admin: dict = Depends(require_admin)):
    cursor.execute(
        "SELECT id, name, email, role, graduation_year, current_organization, current_role, created_at FROM users WHERE role = 'alumni' AND is_approved = 0"
    )
    rows = cursor.fetchall()
    return [
        {
            "id": str(r["id"]),
            "name": r["name"],
            "email": r["email"],
            "graduation_year": r.get("graduation_year"),
            "current_organization": r.get("current_organization"),
            "current_role": r.get("current_role"),
            "created_at": str(r.get("created_at")),
        }
        for r in rows
    ]


@router.post("/{user_id}/approve")
def approve_user(user_id: int, admin: dict = Depends(require_admin)):
    cursor.execute("UPDATE users SET is_approved = 1 WHERE id = %s AND role = 'alumni'", (user_id,))
    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="User not found or not alumni")
    return {"message": "User approved"}


@router.post("/{user_id}/reject")
def reject_user(user_id: int, admin: dict = Depends(require_admin)):
    cursor.execute("DELETE FROM users WHERE id = %s AND role = 'alumni' AND is_approved = 0", (user_id,))
    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="User not found or already approved")
    return {"message": "User rejected"}
