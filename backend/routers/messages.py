"""Conversations and messages."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from database import cursor, db
from deps import get_current_user, get_current_user_id

router = APIRouter(prefix="/messages", tags=["messages"])


class SendMessage(BaseModel):
    content: str


def _get_or_create_conversation(user_id: int, other_user_id: int) -> int:
    cursor.execute(
        "SELECT c.id FROM conversations c "
        "JOIN conversation_participants p1 ON p1.conversation_id = c.id AND p1.user_id = %s "
        "JOIN conversation_participants p2 ON p2.conversation_id = c.id AND p2.user_id = %s",
        (user_id, other_user_id),
    )
    row = cursor.fetchone()
    if row:
        return row["id"]
    cursor.execute("INSERT INTO conversations () VALUES ()")
    conv_id = cursor.lastrowid
    cursor.execute("INSERT INTO conversation_participants (conversation_id, user_id) VALUES (%s, %s), (%s, %s)", (conv_id, user_id, conv_id, other_user_id))
    db.commit()
    return conv_id


@router.get("/conversations")
def list_conversations(current_user: dict = Depends(get_current_user), user_id: int = Depends(get_current_user_id)):
    cursor.execute(
        """SELECT c.id, c.created_at,
           (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
           (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_time
           FROM conversations c
           JOIN conversation_participants p ON p.conversation_id = c.id
           WHERE p.user_id = %s""",
        (user_id,),
    )
    convs = cursor.fetchall()
    result = []
    for c in convs:
        cursor.execute(
            "SELECT u.id, u.name, u.role, u.avatar FROM conversation_participants p JOIN users u ON u.id = p.user_id WHERE p.conversation_id = %s AND p.user_id != %s",
            (c["id"], user_id),
        )
        other = cursor.fetchone()
        if not other:
            continue
        cursor.execute(
            "SELECT COUNT(*) as c FROM messages WHERE conversation_id = %s AND sender_id != %s AND is_read = 0",
            (c["id"], user_id),
        )
        unread = cursor.fetchone()["c"]
        result.append({
            "id": str(c["id"]),
            "participants": [str(current_user["id"]), str(other["id"])],
            "participantNames": [current_user["name"], other["name"]],
            "participantRoles": [current_user["role"], other["role"]],
            "participantAvatars": [current_user.get("avatar"), other.get("avatar")],
            "lastMessage": c.get("last_message") or "",
            "lastMessageTime": str(c["last_time"]) if c.get("last_time") else "",
            "unreadCount": unread,
        })
    return result


@router.get("/conversations/{other_user_id}")
def get_or_create_conversation(other_user_id: int, user_id: int = Depends(get_current_user_id), current_user: dict = Depends(get_current_user)):
    cursor.execute("SELECT id, name, avatar, role FROM users WHERE id = %s", (other_user_id,))
    other = cursor.fetchone()
    if not other:
        raise HTTPException(status_code=404, detail="User not found")
    conv_id = _get_or_create_conversation(user_id, other_user_id)
    return {
        "id": str(conv_id),
        "participants": [str(user_id), str(other_user_id)],
        "participantNames": [current_user["name"], other["name"]],
        "participantRoles": [current_user["role"], other["role"]],
        "participantAvatars": [current_user.get("avatar"), other.get("avatar")],
        "lastMessage": "",
        "lastMessageTime": "",
        "unreadCount": 0,
    }


@router.get("/conversations/{conversation_id}/messages")
def list_messages(conversation_id: int, user_id: int = Depends(get_current_user_id)):
    cursor.execute("SELECT user_id FROM conversation_participants WHERE conversation_id = %s AND user_id = %s", (conversation_id, user_id))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Conversation not found")
    cursor.execute(
        "SELECT m.*, u.name as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.conversation_id = %s ORDER BY m.created_at ASC",
        (conversation_id,),
    )
    rows = cursor.fetchall()
    return [
        {
            "id": str(r["id"]),
            "conversationId": str(r["conversation_id"]),
            "senderId": str(r["sender_id"]),
            "senderName": r.get("sender_name"),
            "content": r["content"],
            "timestamp": str(r["created_at"]) if r.get("created_at") else "",
            "read": bool(r.get("is_read")),
        }
        for r in rows
    ]


@router.post("/conversations/{conversation_id}/messages")
def send_message(conversation_id: int, data: SendMessage, user_id: int = Depends(get_current_user_id), current_user: dict = Depends(get_current_user)):
    cursor.execute("SELECT user_id FROM conversation_participants WHERE conversation_id = %s AND user_id = %s", (conversation_id, user_id))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Conversation not found")
    cursor.execute(
        "INSERT INTO messages (conversation_id, sender_id, content, is_read) VALUES (%s, %s, %s, 0)",
        (conversation_id, user_id, data.content),
    )
    db.commit()
    msg_id = cursor.lastrowid
    cursor.execute("SELECT * FROM messages WHERE id = %s", (msg_id,))
    r = cursor.fetchone()
    return {
        "id": str(r["id"]),
        "conversationId": str(r["conversation_id"]),
        "senderId": str(r["sender_id"]),
        "senderName": current_user["name"],
        "content": r["content"],
        "timestamp": str(r["created_at"]) if r.get("created_at") else "",
        "read": False,
    }


@router.post("/conversations/{conversation_id}/read")
def mark_read(conversation_id: int, user_id: int = Depends(get_current_user_id)):
    cursor.execute("UPDATE messages SET is_read = 1 WHERE conversation_id = %s AND sender_id != %s", (conversation_id, user_id))
    db.commit()
    return {"message": "Marked as read"}
