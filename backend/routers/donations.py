"""Donations: create and list."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from database import cursor, db
from deps import get_current_user, get_current_user_id, require_admin

router = APIRouter(prefix="/donations", tags=["donations"])


class CreateDonation(BaseModel):
    amount: float
    currency: str = "USD"
    message: Optional[str] = None
    is_anonymous: bool = False


def _row_to_donation(row: dict, user_name: Optional[str] = None) -> dict:
    return {
        "id": str(row["id"]),
        "userId": str(row["user_id"]),
        "donorName": None if row.get("is_anonymous") else user_name,
        "amount": float(row["amount"]),
        "currency": row.get("currency") or "USD",
        "message": row.get("message"),
        "isAnonymous": bool(row.get("is_anonymous")),
        "createdAt": str(row["created_at"]) if row.get("created_at") else None,
    }


@router.post("")
def create_donation(data: CreateDonation, user_id: int = Depends(get_current_user_id), current_user: dict = Depends(get_current_user)):
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    cursor.execute(
        "INSERT INTO donations (user_id, amount, currency, message, is_anonymous) VALUES (%s, %s, %s, %s, %s)",
        (user_id, data.amount, data.currency, data.message, 1 if data.is_anonymous else 0),
    )
    db.commit()
    d_id = cursor.lastrowid
    cursor.execute("SELECT * FROM donations WHERE id = %s", (d_id,))
    row = cursor.fetchone()
    return _row_to_donation(row, current_user["name"])


@router.get("")
def list_donations(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") == "admin":
        cursor.execute(
            "SELECT d.*, u.name as donor_name FROM donations d JOIN users u ON d.user_id = u.id ORDER BY d.created_at DESC"
        )
        rows = cursor.fetchall()
        return [
            {
                "id": str(r["id"]),
                "userId": str(r["user_id"]),
                "donorName": None if r.get("is_anonymous") else r.get("donor_name"),
                "amount": float(r["amount"]),
                "currency": r.get("currency") or "USD",
                "message": r.get("message"),
                "isAnonymous": bool(r.get("is_anonymous")),
                "createdAt": str(r["created_at"]) if r.get("created_at") else None,
            }
            for r in rows
        ]
    # Own donations only
    user_id = current_user["id"]
    cursor.execute("SELECT * FROM donations WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
    rows = cursor.fetchall()
    return [_row_to_donation(r, current_user["name"]) for r in rows]


@router.get("/stats")
def donation_stats(admin: dict = Depends(require_admin)):
    cursor.execute("SELECT COUNT(*) as total_count, COALESCE(SUM(amount), 0) as total_amount FROM donations")
    row = cursor.fetchone()
    return {
        "totalDonations": row["total_count"],
        "totalAmount": float(row["total_amount"]),
    }
