"""
Pydantic schemas shared by both account roles: "manager" and "admin".

Both roles register with the same OTP-verified flow, log in the same
way, and use the same forgot-password flow. What differs is only which
role is stamped on the account and which API routes/JWT scope it's
allowed to use afterwards (see app/utils/deps.py).
"""
from pydantic import BaseModel, EmailStr, Field, field_validator


class RegisterInit(BaseModel):
    """Step 1 of registration: submit details, receive an OTP by email."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    confirmPassword: str

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name is required.")
        return v.strip()

    @field_validator("confirmPassword")
    @classmethod
    def passwords_match(cls, v: str, info):
        password = info.data.get("password")
        if password is not None and v != password:
            raise ValueError("Passwords do not match.")
        return v


class VerifyOtp(BaseModel):
    """Step 2 of registration: submit the emailed code to activate the account."""
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)


class ResendOtp(BaseModel):
    email: EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordInit(BaseModel):
    email: EmailStr


class ResetPassword(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)
    newPassword: str = Field(..., min_length=6, max_length=128)
    confirmNewPassword: str

    @field_validator("confirmNewPassword")
    @classmethod
    def passwords_match(cls, v: str, info):
        password = info.data.get("newPassword")
        if password is not None and v != password:
            raise ValueError("Passwords do not match.")
        return v


class AccountOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    isActive: bool
    createdAt: str


class TokenResponse(BaseModel):
    success: bool = True
    token: str
    tokenType: str = "bearer"
    account: AccountOut


class OtpSentResponse(BaseModel):
    success: bool = True
    message: str
    email: EmailStr
    expiresInMinutes: int


class MessageResponse(BaseModel):
    success: bool = True
    message: str


class AccountStatusUpdate(BaseModel):
    isActive: bool
