import json
from fastapi import APIRouter, Response, Request
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class MockUser(BaseModel):
    id: str
    name: str
    email: str
    
    class Config:
        extra = "ignore"

@router.get("/.auth/me")
def auth_me(request: Request):
    user_json = request.cookies.get("mock_user")
    if not user_json:
        return []
    
    try:
        user_data = json.loads(user_json)
    except json.JSONDecodeError:
        return []
        
    return [{
        "user_id": user_data.get("email"),
        "user_claims": [
            { "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name", "val": user_data.get("name") },
            { "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress", "val": user_data.get("email") },
            { "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", "val": user_data.get("id") }
        ]
    }]

@router.post("/.auth/login/mock")
def login(response: Response, user: MockUser):
    user_data = user.model_dump()
    response.set_cookie(key="mock_user", value=json.dumps(user_data), httponly=True)
    return {"user": user_data}

@router.post("/.auth/logout/mock")
def logout(response: Response):
    response.delete_cookie("mock_user")
    return {"message": "Logged out"}
