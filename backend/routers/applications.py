"""Job applications."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from database import cursor, db
from deps import get_current_user, get_current_user_id, require_admin

router = APIRouter(prefix="/applications", tags=["applications"])


class CreateApplication(BaseModel):
    job_id: int
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None


class UpdateApplicationStatus(BaseModel):
    status: str


def _row_to_app(row: dict, student_name: str = "") -> dict:
    return {
        "id": str(row["id"]),
        "jobId": str(row["job_id"]),
        "studentId": str(row["student_id"]),
        "studentName": student_name,
        "coverLetter": row.get("cover_letter"),
        "resume": row.get("resume_url"),
        "appliedDate": str(row["created_at"].date()) if row.get("created_at") else "",
        "status": row.get("status") or "pending",
    }


@router.get("")
def list_applications(job_id: Optional[int] = None, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    role = current_user["role"]
    if job_id is not None:
        cursor.execute("SELECT posted_by_id FROM jobs WHERE id = %s", (job_id,))
        job = cursor.fetchone()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        if role != "admin" and job["posted_by_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not your job")
        cursor.execute(
            """SELECT a.*, u.name as student_name FROM applications a
               JOIN users u ON a.student_id = u.id WHERE a.job_id = %s ORDER BY a.created_at DESC""",
            (job_id,),
        )
    else:
        if role == "student":
            cursor.execute(
                """SELECT a.*, u.name as student_name FROM applications a
                   JOIN users u ON a.student_id = u.id WHERE a.student_id = %s ORDER BY a.created_at DESC""",
                (user_id,),
            )
        else:
            cursor.execute(
                """SELECT a.*, u.name as student_name FROM applications a
                   JOIN users u ON a.student_id = u.id ORDER BY a.created_at DESC"""
            )
    rows = cursor.fetchall()
    return [_row_to_app(r, r.get("student_name") or "") for r in rows]


@router.post("")
def create_application(data: CreateApplication, user_id: int = Depends(get_current_user_id), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can apply")
    cursor.execute("SELECT id FROM jobs WHERE id = %s", (data.job_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Job not found")
    cursor.execute("SELECT id FROM applications WHERE job_id = %s AND student_id = %s", (data.job_id, user_id))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Already applied")
    cursor.execute(
        "INSERT INTO applications (job_id, student_id, cover_letter, resume_url, status) VALUES (%s, %s, %s, %s, 'pending')",
        (data.job_id, user_id, data.cover_letter, data.resume_url),
    )
    db.commit()
    app_id = cursor.lastrowid
    cursor.execute("SELECT a.*, u.name as student_name FROM applications a JOIN users u ON a.student_id = u.id WHERE a.id = %s", (app_id,))
    return _row_to_app(cursor.fetchone(), current_user["name"])


@router.patch("/{app_id}")
def update_application_status(app_id: int, data: UpdateApplicationStatus, current_user: dict = Depends(get_current_user)):
    cursor.execute("SELECT a.*, j.posted_by_id FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.id = %s", (app_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Application not found")
    if current_user["role"] != "admin" and row["posted_by_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    if data.status not in ("pending", "reviewed", "accepted", "rejected"):
        raise HTTPException(status_code=400, detail="Invalid status")
    cursor.execute("UPDATE applications SET status = %s WHERE id = %s", (data.status, app_id))
    db.commit()
    return {"message": "Updated"}
