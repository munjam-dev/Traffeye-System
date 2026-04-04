import httpx
from fastapi import HTTPException
from config.settings import settings

class GoogleAuth:
    def __init__(self):
        self.client_id = settings.GOOGLE_CLIENT_ID
        self.client_secret = settings.GOOGLE_CLIENT_SECRET
        self.token_info_url = "https://www.googleapis.com/oauth2/v1/tokeninfo"
        self.user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"

    async def verify_token(self, token: str) -> dict:
        """Verify Google OAuth token and get user info"""
        try:
            async with httpx.AsyncClient() as client:
                # Verify token
                token_response = await client.get(
                    f"{self.token_info_url}?access_token={token}"
                )
                
                if token_response.status_code != 200:
                    raise HTTPException(status_code=401, detail="Invalid Google token")
                
                token_data = token_response.json()
                
                # Get user info
                user_response = await client.get(
                    self.user_info_url,
                    headers={"Authorization": f"Bearer {token}"}
                )
                
                if user_response.status_code != 200:
                    raise HTTPException(status_code=401, detail="Failed to get user info")
                
                user_data = user_response.json()
                
                return {
                    "id": user_data.get("id"),
                    "email": user_data.get("email"),
                    "name": user_data.get("name"),
                    "picture": user_data.get("picture"),
                    "verified_email": user_data.get("verified_email", False)
                }
                
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Google auth error: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")
