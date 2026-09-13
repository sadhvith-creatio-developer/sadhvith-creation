"""FastAPI JWT auth guards.

- get_current_manager  -> allows BOTH "manager" and "admin" tokens, since
  Admin has full access to everything Manager does (product management).
- get_current_admin    -> allows ONLY "admin" tokens; used for admin-only
  endpoints (managing manager accounts, admin-wide dashboard).

Both re-fetch the account from the database on every request (rather than
trusting the JWT payload alone), so a deactivated account is rejected
immediately even if its token hasn't expired yet.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.services.account_service import get_account_by_id
from app.utils.security import decode_access_token

bearer_scheme = HTTPBearer(auto_error=False)


def _authenticate(credentials: HTTPAuthorizationCredentials | None, allowed_roles: set[str]) -> dict:
    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Authentication required.")

    payload = decode_access_token(credentials.credentials)
    if not payload or "sub" not in payload:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired session. Please log in again.")

    return get_account_by_id(payload["sub"], allowed_roles)


def get_current_manager(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> dict:
    """Manager-level access: manager OR admin tokens both work."""
    return _authenticate(credentials, {"manager", "admin"})


def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> dict:
    """Admin-only access: only an admin token works."""
    return _authenticate(credentials, {"admin"})
