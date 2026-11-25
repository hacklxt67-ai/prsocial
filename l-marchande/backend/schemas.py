from pydantic import BaseModel, Field
from typing import Optional, List, Any, Literal

# --- Auth Schemas ---
class UserRegisterRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=120)
    username: str = Field(..., min_length=3, max_length=32)
    password: str = Field(..., min_length=6)
    role: Optional[Literal["worker", "advertiser"]] = "worker"
    referral_code: Optional[str] = None
    ref: Optional[str] = None
    cfToken: Optional[str] = None
    fingerprint: Optional[str] = None

class UserLoginRequest(BaseModel):
    username_or_email: Optional[str] = None
    email: Optional[str] = None
    password: str
    cfToken: Optional[str] = None
    fingerprint: Optional[str] = None

class TokenResponse(BaseModel):
    ok: bool = True
    access_token: str
    token_type: str = "bearer"
    user: dict

# --- Social Account Schemas ---
class SocialAccountCreate(BaseModel):
    platform: str
    account_identifier: str
    account_url: Optional[str] = None

# --- Campaign Schemas ---
class CampaignCreateRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=120)
    description: Optional[str] = ""
    platform: str
    action_type: str
    target_url: str
    reward_per_action: float = Field(..., gt=0.0001)
    target_quantity: int = Field(..., gt=0)

# --- Task Execution & Verification Schemas ---
class TaskStartRequest(BaseModel):
    social_account_id: Optional[int] = None

class TaskProofSubmitRequest(BaseModel):
    proof_type: str = "api_check"  # 'api_check', 'screenshot', 'token', 'surf_time'
    proof_data: Optional[str] = ""

# --- Wallet & Finance Schemas ---
class DepositRequest(BaseModel):
    amount: float = Field(..., gt=0.0)
    payment_method: str = "crypto_usdt"  # 'crypto_usdt', 'payeer', 'card', 'mobile_money'

class WithdrawalRequest(BaseModel):
    amount: float = Field(..., gt=0.5)
    payment_method: str
    account_details: str
