"""
Authentication endpoints for BOTH account roles ("manager" and "admin").

Rather than duplicating the same routes twice, `build_auth_router(role)`
builds one router per role — mounted in app/main.py as:
  /api/auth/manager/...
  /api/auth/admin/...

Flow:
  Register: POST .../register/send-otp -> POST .../register/verify-otp
            (optionally POST .../register/resend-otp)
  Login:    POST .../login
  Session:  GET  .../me   (requires bearer token)
  Logout:   POST .../logout
  Forgot password: POST .../forgot-password/send-otp
                   -> POST .../forgot-password/reset
"""
from fastapi import APIRouter, Depends, status

from app.schemas.account import (
    RegisterInit, VerifyOtp, ResendOtp, LoginRequest,
    ForgotPasswordInit, ResetPassword,
    TokenResponse, OtpSentResponse, MessageResponse,
)
from app.services import account_service
from app.utils.deps import get_current_manager, get_current_admin


def build_auth_router(role: str) -> APIRouter:
    router = APIRouter(prefix=f"/api/auth/{role}", tags=[f"auth-{role}"])
    guard = get_current_admin if role == "admin" else get_current_manager

    @router.post(
        "/register/send-otp",
        response_model=OtpSentResponse,
        status_code=status.HTTP_200_OK
    )
    async def register_send_otp(payload: RegisterInit):
        return await account_service.request_registration_otp(
            role,
            payload
        )

    @router.post(
        "/register/resend-otp",
        response_model=OtpSentResponse
    )
    async def register_resend_otp(payload: ResendOtp):
        return await account_service.resend_registration_otp(
            role,
            payload.email
        )

    @router.post("/register/verify-otp", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
    async def register_verify_otp(payload: VerifyOtp):
        return await account_service.verify_registration_otp(role, payload.email, payload.otp)

    @router.post("/login", response_model=TokenResponse)
    def login(payload: LoginRequest):
        return account_service.login(role, payload)

    @router.get("/me")
    def me(current_account: dict = Depends(guard)):
        return {"success": True, "account": current_account}

    @router.post("/logout", response_model=MessageResponse)
    def logout():
        # JWTs are stateless; logout is a frontend concern (discard the token).
        return {"success": True, "message": "Logged out."}

    @router.post(
        "/forgot-password/send-otp",
        response_model=OtpSentResponse
    )
    async def forgot_password_send_otp(
        payload: ForgotPasswordInit
    ):
        return await account_service.request_password_reset_otp(
            role,
            payload.email
        )
    @router.post("/forgot-password/reset", response_model=MessageResponse)
    def forgot_password_reset(payload: ResetPassword):
        return account_service.reset_password(role, payload)

    return router


manager_auth_router = build_auth_router("manager")
admin_auth_router = build_auth_router("admin")
