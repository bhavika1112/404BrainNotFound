"""Jobs CRUD."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from database import cursor, db
from deps import get_current_user, get_current_user_id, require_admin

router = APIRouter(prefix="/jobs", tags=["jobs"])


class CreateJob(BaseModel):
    title: str
    company: str
    location: str
    type: str
    description: str
    requirements: List[str] = []


class UpdateJob(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    status: Optional[str] = None


def _row_to_job(row: dict, applicant_count: int = 0) -> dict:
    import json
    req = row.get("requirements")
    if isinstance(req, str):
        try:
            req = json.loads(req) if req else []
        except Exception:
            req = []
    return {
        "id": str(row["id"]),
        "title": row["title"],
        "company": row["company"],
        "location": row["location"],
        "type": row["type"],
        "description": row["description"],
        "requirements": req or [],
        "postedBy": row["posted_by_name"],
        "postedById": str(row["posted_by_id"]),
        "postedDate": str(row["created_at"].date()) if row.get("created_at") else "",
        "applicants": applicant_count,
        "status": row.get("status") or "open",
    }


@router.get("")
def list_jobs(current_user: dict = Depends(get_current_user)):
    cursor.execute(
        "SELECT j.id, j.title, j.company, j.location, j.type, j.description, j.requirements, j.posted_by_id, j.posted_by_name, j.status, j.created_at FROM jobs j ORDER BY j.created_at DESC"
    )
    rows = cursor.fetchall()
    result = []
    for r in rows:
        cursor.execute("SELECT COUNT(*) as c FROM applications WHERE job_id = %s", (r["id"],))
        count = cursor.fetchone()["c"]
        result.append(_row_to_job(r, count))
    return result


@router.post("")
def create_job(data: CreateJob, user_id: int = Depends(get_current_user_id), current_user: dict = Depends(get_current_user)):
    import json
    cursor.execute(
        "INSERT INTO jobs (title, company, location, type, description, requirements, posted_by_id, posted_by_name, status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'open')",
        (
            data.title,
            data.company,
            data.location,
            data.type,
            data.description,
            json.dumps(data.requirements),
            user_id,
            current_user["name"],
        ),
    )
    db.commit()
    job_id = cursor.lastrowid
    cursor.execute("SELECT * FROM jobs WHERE id = %s", (job_id,))
    return _row_to_job(cursor.fetchone(), 0)


@router.get("/{job_id}")
def get_job(job_id: int, current_user: dict = Depends(get_current_user)):
    cursor.execute("SELECT * FROM jobs WHERE id = %s", (job_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Job not found")
    cursor.execute("SELECT COUNT(*) as c FROM applications WHERE job_id = %s", (job_id,))
    count = cursor.fetchone()["c"]
    return _row_to_job(row, count)


@router.patch("/{job_id}")
def update_job(job_id: int, data: UpdateJob, user_id: int = Depends(get_current_user_id), current_user: dict = Depends(get_current_user)):
    import json
    cursor.execute("SELECT posted_by_id, role FROM users WHERE id = %s", (user_id,))
    u = cursor.fetchone()
    cursor.execute("SELECT posted_by_id FROM jobs WHERE id = %s", (job_id,))
    job = cursor.fetchone()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if current_user.get("role") != "admin" and job["posted_by_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not your job")
    updates = data.model_dump(exclude_unset=True)
    if not updates:
        return get_job(job_id, current_user)
    if "requirements" in updates and isinstance(updates["requirements"], list):
        updates["requirements"] = json.dumps(updates["requirements"])
    set_clause = ", ".join(f"{k} = %s" for k in updates)
    values = list(updates.values()) + [job_id]
    cursor.execute(f"UPDATE jobs SET {set_clause} WHERE id = %s", values)
    db.commit()
    return get_job(job_id, current_user)


@router.delete("/{job_id}")
def delete_job(job_id: int, user_id: int = Depends(get_current_user_id), current_user: dict = Depends(get_current_user)):
    cursor.execute("SELECT posted_by_id FROM jobs WHERE id = %s", (job_id,))
    job = cursor.fetchone()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if current_user.get("role") != "admin" and job["posted_by_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not your job")
    cursor.execute("DELETE FROM jobs WHERE id = %s", (job_id,))
    db.commit()
    return {"message": "Deleted"}
