"""Mentorship requests."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from database import cursor, db
from deps import get_current_user, get_current_user_id, require_admin

router = APIRouter(prefix="/mentorship", tags=["mentorship"])


class CreateMentorshipRequest(BaseModel):
    mentor_id: int
    domain: str
    message: str


class UpdateStatus(BaseModel):
    status: str  # accepted | rejected


def _row_to_request(row: dict, student_name: str = "", mentor_name: str = "") -> dict:
    return {
        "id": str(row["id"]),
        "studentId": str(row["student_id"]),
        "studentName": student_name,
        "mentorId": str(row["mentor_id"]),
        "mentorName": mentor_name,
        "domain": row["domain"],
        "message": row["message"],
        "status": row.get("status") or "pending",
        "requestDate": str(row["created_at"].date()) if row.get("created_at") else "",
    }


@router.get("")
def list_mentorship_requests(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    role = current_user["role"]
    if role == "alumni":
        cursor.execute(
            """SELECT m.*, u1.name as student_name, u2.name as mentor_name
               FROM mentorship_requests m
               JOIN users u1 ON m.student_id = u1.id
               JOIN users u2 ON m.mentor_id = u2.id
               WHERE m.mentor_id = %s ORDER BY m.created_at DESC""",
            (user_id,),
        )
    elif role == "student":
        cursor.execute(
            """SELECT m.*, u1.name as student_name, u2.name as mentor_name
               FROM mentorship_requests m
               JOIN users u1 ON m.student_id = u1.id
               JOIN users u2 ON m.mentor_id = u2.id
               WHERE m.student_id = %s ORDER BY m.created_at DESC""",
            (user_id,),
        )
    else:
        cursor.execute(
            """SELECT m.*, u1.name as student_name, u2.name as mentor_name
               FROM mentorship_requests m
               JOIN users u1 ON m.student_id = u1.id
               JOIN users u2 ON m.mentor_id = u2.id
               ORDER BY m.created_at DESC"""
        )
    rows = cursor.fetchall()
    return [
        _row_to_request(
            r,
            r.get("student_name") or "",
            r.get("mentor_name") or "",
        )
        for r in rows
    ]


@router.post("")
def create_mentorship_request(data: CreateMentorshipRequest, user_id: int = Depends(get_current_user_id), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can request mentorship")
    cursor.execute("SELECT id, name FROM users WHERE id = %s AND role = 'alumni'", (data.mentor_id,))
    mentor = cursor.fetchone()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    cursor.execute(
        "INSERT INTO mentorship_requests (student_id, mentor_id, domain, message, status) VALUES (%s, %s, %s, %s, 'pending')",
        (user_id, data.mentor_id, data.domain, data.message),
    )
    db.commit()
    req_id = cursor.lastrowid
    cursor.execute(
        "SELECT m.*, u1.name as student_name, u2.name as mentor_name FROM mentorship_requests m JOIN users u1 ON m.student_id = u1.id JOIN users u2 ON m.mentor_id = u2.id WHERE m.id = %s",
        (req_id,),
    )
    return _row_to_request(cursor.fetchone(), current_user["name"], mentor["name"])


@router.patch("/{request_id}")
def update_mentorship_status(request_id: int, data: UpdateStatus, user_id: int = Depends(get_current_user_id), current_user: dict = Depends(get_current_user)):
    if data.status not in ("accepted", "rejected"):
        raise HTTPException(status_code=400, detail="Status must be accepted or rejected")
    cursor.execute("SELECT mentor_id FROM mentorship_requests WHERE id = %s", (request_id,))
    req = cursor.fetchone()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if current_user["role"] != "admin" and req["mentor_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not your request")
    cursor.execute("UPDATE mentorship_requests SET status = %s WHERE id = %s", (data.status, request_id))
    db.commit()
    return {"message": "Updated"}
