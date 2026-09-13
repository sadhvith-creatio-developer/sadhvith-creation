"""OTP (one-time password) generation and verification helpers.

OTPs are 6-digit numeric codes, short-lived, and stored hashed (never in
plain text) in the `otps` collection — see app/services/account_service.py
for how they're issued and checked.
"""
import hashlib
import secrets

from app.config import settings


def generate_otp() -> str:
    """A random 6-digit code, e.g. '048213'. Uses `secrets` (CSPRNG), not `random`."""
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_otp(otp: str, email: str) -> str:
    """Hash the OTP together with the email + JWT secret as a pepper, so a
    leaked `otps` collection alone can't be used to guess/replay codes."""
    payload = f"{email.lower()}:{otp}:{settings.JWT_SECRET}".encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def verify_otp(otp: str, email: str, otp_hash: str) -> bool:
    return secrets.compare_digest(hash_otp(otp, email), otp_hash)
