"""
Admin-only endpoints — everything here requires an admin token
(get_current_admin). This is what gives the separate Admin dashboard its
"full access": full product control (via the shared get_current_manager
guard on routes/products.py and routes/manager.py) PLUS the ability to
see and manage every Manager account.
"""
from fastapi import APIRouter, Depends

from app.schemas.account import AccountStatusUpdate, MessageResponse
from app.services import account_service, product_service
from app.utils.deps import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/dashboard")
def admin_dashboard(current_admin: dict = Depends(get_current_admin)):
    stats = product_service.get_dashboard_stats()
    stats.update(account_service.get_role_counts())
    return {"success": True, "account": current_admin, "stats": stats}


@router.get("/managers")
def list_managers(current_admin: dict = Depends(get_current_admin)):
    managers = account_service.list_accounts("manager")
    return {"success": True, "count": len(managers), "managers": managers}


@router.patch("/managers/{account_id}/status")
def set_manager_status(
    account_id: str,
    payload: AccountStatusUpdate,
    current_admin: dict = Depends(get_current_admin),
):
    manager = account_service.set_account_active(account_id, payload.isActive, restrict_to_role="manager")
    return {"success": True, "message": "Manager status updated.", "manager": manager}


@router.delete("/managers/{account_id}", response_model=MessageResponse)
def delete_manager(account_id: str, current_admin: dict = Depends(get_current_admin)):
    account_service.delete_account(account_id, restrict_to_role="manager")
    return {"success": True, "message": "Manager account deleted."}


@router.get("/admins")
def list_admins(current_admin: dict = Depends(get_current_admin)):
    admins = account_service.list_accounts("admin")
    return {"success": True, "count": len(admins), "admins": admins}
