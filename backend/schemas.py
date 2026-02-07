from pydantic import BaseModel

# Request Schemas
class ItemRequest(BaseModel):
    name: str
    description: str
    price: float
    quantity: int

class UserRequest(BaseModel):
    username: str
    password: str

# Response Schemas
class ItemResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    quantity: int

class UserResponse(BaseModel):
    id: int
    username: str
    created_at: str
