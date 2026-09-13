"""
Business logic shared by both account roles ("manager" and "admin").

Both roles live in the single `db.accounts` collection, distinguished by
the `role` field. This keeps registration/login/forgot-password logic in
one place instead of duplicating it per role, while the API routes and
JWT scoping (see app/utils/deps.py) still keep the two roles' actual
permissions separate — "admin" additionally gets access to
manager-account management endpoints.

Registration is a two-step, OTP-verified flow:
  1. request_registration_otp — validate the submitted details, make sure
     the email isn't already a verified account, generate a 6-digit OTP,
     email it, and stash the pending registration (name + password hash)
     in the `otps` collection alongside the OTP hash.
  2. verify_registration_otp — check the code, and only THEN create the
     real account document. Nothing is written to `accounts` until the
     email is verified.
"""
from datetime import datetime, timedelta, timezone

from bson import ObjectId
from fastapi import HTTPException, status

from app.config import settings
from app.database import get_db
from app.schemas.account import (
    RegisterInit, LoginRequest, ResetPassword,
)
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.otp import generate_otp, hash_otp, verify_otp
from app.utils.email_service import send_otp_email

VALID_ROLES = {"manager", "admin"}


def _serialize_account(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "email": doc["email"],
        "role": doc["role"],
        "isActive": doc.get("isActive", True),
        "createdAt": doc["createdAt"].isoformat() if isinstance(doc.get("createdAt"), datetime) else doc.get("createdAt", ""),
    }


def _require_role(role: str) -> None:
    if role not in VALID_ROLES:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid account role.")


# ---------------------------------------------------------------------------
# Registration (send OTP -> verify OTP -> account created)
# ---------------------------------------------------------------------------
def request_registration_otp(role: str, payload: RegisterInit) -> dict:
    _require_role(role)
    db = get_db()
    email = payload.email.lower()

    if db.accounts.find_one({"email": email}):
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists.")

    _check_resend_cooldown(db, email, role, "register")

    otp = generate_otp()
    now = datetime.now(timezone.utc)
    db.otps.update_one(
        {"email": email, "role": role, "purpose": "register"},
        {"$set": {
            "email": email,
            "role": role,
            "purpose": "register",
            "otpHash": hash_otp(otp, email),
            "attempts": 0,
            "pendingName": payload.name,
            "pendingPasswordHash": hash_password(payload.password),
            "createdAt": now,
            "expiresAt": now + timedelta(minutes=settings.OTP_EXPIRE_MINUTES),
        }},
        upsert=True,
    )

    send_otp_email(email, payload.name, otp, purpose="register")
    return {
        "success": True,
        "message": f"A verification code was sent to {email}.",
        "email": email,
        "expiresInMinutes": settings.OTP_EXPIRE_MINUTES,
    }


def resend_registration_otp(role: str, email: str) -> dict:
    _require_role(role)
    db = get_db()
    email = email.lower()

    otp_doc = db.otps.find_one({"email": email, "role": role, "purpose": "register"})
    if not otp_doc:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "No pending registration found for this email. Please register again.",
        )
    _check_resend_cooldown(db, email, role, "register")

    otp = generate_otp()
    now = datetime.now(timezone.utc)
    db.otps.update_one(
        {"_id": otp_doc["_id"]},
        {"$set": {
            "otpHash": hash_otp(otp, email),
            "attempts": 0,
            "createdAt": now,
            "expiresAt": now + timedelta(minutes=settings.OTP_EXPIRE_MINUTES),
        }},
    )
    send_otp_email(email, otp_doc.get("pendingName", ""), otp, purpose="register")
    return {
        "success": True,
        "message": f"A new verification code was sent to {email}.",
        "email": email,
        "expiresInMinutes": settings.OTP_EXPIRE_MINUTES,
    }


def verify_registration_otp(role: str, email: str, otp: str) -> dict:
    _require_role(role)
    db = get_db()
    email = email.lower()

    otp_doc = db.otps.find_one({"email": email, "role": role, "purpose": "register"})
    if not otp_doc:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "No pending registration found for this email. Please register again.",
        )

    _consume_otp_attempt_or_raise(db, otp_doc, otp, email)

    now = datetime.now(timezone.utc)
    account_doc = {
        "name": otp_doc["pendingName"],
        "email": email,
        "passwordHash": otp_doc["pendingPasswordHash"],
        "role": role,
        "isActive": True,
        "emailVerified": True,
        "createdAt": now,
        "updatedAt": now,
    }
    result = db.accounts.insert_one(account_doc)
    account_doc["_id"] = result.inserted_id
    db.otps.delete_one({"_id": otp_doc["_id"]})

    token = create_access_token({"sub": str(account_doc["_id"]), "email": email, "role": role})
    return {"success": True, "token": token, "tokenType": "bearer", "account": _serialize_account(account_doc)}


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------
def login(role: str, payload: LoginRequest) -> dict:
    _require_role(role)
    db = get_db()
    email = payload.email.lower()

    account_doc = db.accounts.find_one({"email": email, "role": role})
    if not account_doc or not verify_password(payload.password, account_doc["passwordHash"]):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password.")

    if not account_doc.get("isActive", True):
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "This account has been deactivated. Please contact an administrator.",
        )

    token = create_access_token({"sub": str(account_doc["_id"]), "email": email, "role": role})
    return {"success": True, "token": token, "tokenType": "bearer", "account": _serialize_account(account_doc)}


def get_account_by_id(account_id: str, allowed_roles: set[str]) -> dict:
    db = get_db()
    try:
        oid = ObjectId(account_id)
    except Exception:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid authentication token.")

    account_doc = db.accounts.find_one({"_id": oid})
    if not account_doc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Account no longer exists.")
    if account_doc.get("role") not in allowed_roles:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "You do not have access to this resource.")
    if not account_doc.get("isActive", True):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "This account has been deactivated.")
    return _serialize_account(account_doc)


# ---------------------------------------------------------------------------
# Forgot password (OTP-verified reset)
# ---------------------------------------------------------------------------
def request_password_reset_otp(role: str, email: str) -> dict:
    _require_role(role)
    db = get_db()
    email = email.lower()

    account_doc = db.accounts.find_one({"email": email, "role": role})
    generic_response = {
        "success": True,
        "message": f"If an account exists for {email}, a reset code has been sent.",
        "email": email,
        "expiresInMinutes": settings.OTP_EXPIRE_MINUTES,
    }
    if not account_doc:
        # Don't reveal whether the email is registered.
        return generic_response

    _check_resend_cooldown(db, email, role, "reset")

    otp = generate_otp()
    now = datetime.now(timezone.utc)
    db.otps.update_one(
        {"email": email, "role": role, "purpose": "reset"},
        {"$set": {
            "email": email,
            "role": role,
            "purpose": "reset",
            "otpHash": hash_otp(otp, email),
            "attempts": 0,
            "createdAt": now,
            "expiresAt": now + timedelta(minutes=settings.OTP_EXPIRE_MINUTES),
        }},
        upsert=True,
    )
    send_otp_email(email, account_doc.get("name", ""), otp, purpose="reset")
    return generic_response


def reset_password(role: str, payload: ResetPassword) -> dict:
    _require_role(role)
    db = get_db()
    email = payload.email.lower()

    otp_doc = db.otps.find_one({"email": email, "role": role, "purpose": "reset"})
    if not otp_doc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No password reset was requested for this email.")

    _consume_otp_attempt_or_raise(db, otp_doc, payload.otp, email)

    account_doc = db.accounts.find_one({"email": email, "role": role})
    if not account_doc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Account not found.")

    db.accounts.update_one(
        {"_id": account_doc["_id"]},
        {"$set": {"passwordHash": hash_password(payload.newPassword), "updatedAt": datetime.now(timezone.utc)}},
    )
    db.otps.delete_one({"_id": otp_doc["_id"]})
    return {"success": True, "message": "Password reset successfully. You can now log in."}


# ---------------------------------------------------------------------------
# Admin: manage manager accounts
# ---------------------------------------------------------------------------
def list_accounts(role: str) -> list[dict]:
    _require_role(role)
    db = get_db()
    docs = db.accounts.find({"role": role}).sort("createdAt", -1)
    return [_serialize_account(doc) for doc in docs]


def set_account_active(account_id: str, is_active: bool, restrict_to_role: str | None = None) -> dict:
    db = get_db()
    try:
        oid = ObjectId(account_id)
    except Exception:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid account id.")

    account_doc = db.accounts.find_one({"_id": oid})
    if not account_doc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Account not found.")
    if restrict_to_role and account_doc.get("role") != restrict_to_role:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "You cannot modify this account.")

    db.accounts.update_one({"_id": oid}, {"$set": {"isActive": is_active, "updatedAt": datetime.now(timezone.utc)}})
    account_doc["isActive"] = is_active
    return _serialize_account(account_doc)


def delete_account(account_id: str, restrict_to_role: str | None = None) -> None:
    db = get_db()
    try:
        oid = ObjectId(account_id)
    except Exception:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid account id.")

    account_doc = db.accounts.find_one({"_id": oid})
    if not account_doc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Account not found.")
    if restrict_to_role and account_doc.get("role") != restrict_to_role:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "You cannot delete this account.")

    db.accounts.delete_one({"_id": oid})


def get_role_counts() -> dict:
    db = get_db()
    return {
        "totalManagers": db.accounts.count_documents({"role": "manager"}),
        "activeManagers": db.accounts.count_documents({"role": "manager", "isActive": True}),
        "totalAdmins": db.accounts.count_documents({"role": "admin"}),
    }


# ---------------------------------------------------------------------------
# Internal OTP helpers
# ---------------------------------------------------------------------------
def _check_resend_cooldown(db, email: str, role: str, purpose: str) -> None:
    existing = db.otps.find_one({"email": email, "role": role, "purpose": purpose})
    if not existing:
        return
    age = datetime.now(timezone.utc) - existing["createdAt"].replace(tzinfo=timezone.utc)
    if age.total_seconds() < settings.OTP_RESEND_COOLDOWN_SECONDS:
        wait = int(settings.OTP_RESEND_COOLDOWN_SECONDS - age.total_seconds())
        raise HTTPException(
            status.HTTP_429_TOO_MANY_REQUESTS,
            f"Please wait {wait} seconds before requesting another code.",
        )


def _consume_otp_attempt_or_raise(db, otp_doc: dict, submitted_otp: str, email: str) -> None:
    expires_at = otp_doc["expiresAt"].replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) > expires_at:
        db.otps.delete_one({"_id": otp_doc["_id"]})
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "This code has expired. Please request a new one.")

    if otp_doc.get("attempts", 0) >= settings.OTP_MAX_ATTEMPTS:
        db.otps.delete_one({"_id": otp_doc["_id"]})
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Too many incorrect attempts. Please request a new code.",
        )

    if not verify_otp(submitted_otp, email, otp_doc["otpHash"]):
        db.otps.update_one({"_id": otp_doc["_id"]}, {"$inc": {"attempts": 1}})
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Incorrect code. Please try again.")
