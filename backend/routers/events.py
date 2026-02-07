"""Events CRUD and registration."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from database import cursor, db
from deps import get_current_user, get_current_user_id, require_admin

router = APIRouter(prefix="/events", tags=["events"])


class CreateEvent(BaseModel):
    title: str
    event_date: str
    event_time: str
    location: str
    description: str
    type: str
    max_capacity: Optional[int] = None
    organizer: str


class UpdateEvent(BaseModel):
    title: Optional[str] = None
    event_date: Optional[str] = None
    event_time: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    max_capacity: Optional[int] = None
    organizer: Optional[str] = None
    status: Optional[str] = None


def _row_to_event(row: dict, registered_count: int = 0) -> dict:
    return {
        "id": str(row["id"]),
        "title": row["title"],
        "date": str(row["event_date"]) if row.get("event_date") else "",
        "time": row.get("event_time") or "",
        "location": row["location"],
        "description": row["description"],
        "type": row["type"],
        "maxCapacity": row.get("max_capacity"),
        "registeredCount": registered_count,
        "organizer": row["organizer"],
        "status": row.get("status") or "upcoming",
    }


@router.get("")
def list_events(current_user: dict = Depends(get_current_user)):
    cursor.execute(
        "SELECT id, title, event_date, event_time, location, description, type, max_capacity, organizer, status, created_at FROM events ORDER BY event_date, event_time"
    )
    rows = cursor.fetchall()
    result = []
    for r in rows:
        cursor.execute("SELECT COUNT(*) as c FROM event_registrations WHERE event_id = %s", (r["id"],))
        count = cursor.fetchone()["c"]
        result.append(_row_to_event(r, count))
    return result


@router.post("")
def create_event(data: CreateEvent, current_user: dict = Depends(get_current_user)):
    cursor.execute(
        "INSERT INTO events (title, event_date, event_time, location, description, type, max_capacity, organizer, status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'upcoming')",
        (
            data.title,
            data.event_date,
            data.event_time,
            data.location,
            data.description,
            data.type,
            data.max_capacity,
            data.organizer,
        ),
    )
    db.commit()
    eid = cursor.lastrowid
    cursor.execute("SELECT * FROM events WHERE id = %s", (eid,))
    return _row_to_event(cursor.fetchone(), 0)


@router.get("/{event_id}")
def get_event(event_id: int, current_user: dict = Depends(get_current_user)):
    cursor.execute("SELECT * FROM events WHERE id = %s", (event_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Event not found")
    cursor.execute("SELECT COUNT(*) as c FROM event_registrations WHERE event_id = %s", (event_id,))
    count = cursor.fetchone()["c"]
    return _row_to_event(row, count)


@router.patch("/{event_id}")
def update_event(event_id: int, data: UpdateEvent, admin: dict = Depends(require_admin)):
    updates = data.model_dump(exclude_unset=True)
    if not updates:
        return get_event(event_id, admin)
    key_map = {"event_date": "event_date", "event_time": "event_time"}
    updates_rename = {key_map.get(k, k): v for k, v in updates.items()}
    set_clause = ", ".join(f"`{k}` = %s" for k in updates_rename)
    values = list(updates_rename.values()) + [event_id]
    cursor.execute(f"UPDATE events SET {set_clause} WHERE id = %s", values)
    db.commit()
    cursor.execute("SELECT * FROM events WHERE id = %s", (event_id,))
    row = cursor.fetchone()
    cursor.execute("SELECT COUNT(*) as c FROM event_registrations WHERE event_id = %s", (event_id,))
    return _row_to_event(row, cursor.fetchone()["c"])


@router.delete("/{event_id}")
def delete_event(event_id: int, admin: dict = Depends(require_admin)):
    cursor.execute("DELETE FROM events WHERE id = %s", (event_id,))
    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Deleted"}


@router.post("/{event_id}/register")
def register_for_event(event_id: int, user_id: int = Depends(get_current_user_id)):
    cursor.execute("SELECT id, max_capacity FROM events WHERE id = %s", (event_id,))
    event = cursor.fetchone()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    cursor.execute("SELECT COUNT(*) as c FROM event_registrations WHERE event_id = %s", (event_id,))
    count = cursor.fetchone()["c"]
    if event.get("max_capacity") and count >= event["max_capacity"]:
        raise HTTPException(status_code=400, detail="Event is full")
    try:
        cursor.execute("INSERT INTO event_registrations (event_id, user_id) VALUES (%s, %s)", (event_id, user_id))
        db.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Already registered")
    return {"message": "Registered"}
