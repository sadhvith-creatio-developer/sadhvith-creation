"""
Minimal SMTP email sending, used only for OTP codes (registration
verification + password reset).

No third-party email SDK is used — Python's built-in smtplib is enough
for a single transactional message at a time. If SMTP_HOST is not
configured (e.g. local development), the email is logged to the server
console instead of sent, so the OTP flow can still be tested end-to-end
without a real mail provider.
"""
import logging
import smtplib
from email.message import EmailMessage

from app.config import settings

logger = logging.getLogger("sadhvith.email")


def send_email(to_email: str, subject: str, body: str) -> None:
    if not settings.SMTP_HOST:
        # Dev fallback: no SMTP configured, print instead of sending.
        logger.warning(
            "SMTP is not configured (SMTP_HOST is empty). Logging email "
            "instead of sending it. Set SMTP_HOST/SMTP_USERNAME/SMTP_PASSWORD "
            "in backend/.env to send real emails."
        )
        logger.info("---- EMAIL (dev fallback) ----\nTo: %s\nSubject: %s\n\n%s\n-------------------------------",
                     to_email, subject, body)
        return

    message = EmailMessage()
    message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            if settings.SMTP_USE_TLS:
                server.starttls()
            if settings.SMTP_USERNAME:
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(message)
    except Exception as exc:  # noqa: BLE001 — surfaced to the caller as a clean HTTP error
        logger.error("Failed to send email to %s: %s", to_email, exc)
        raise


def send_otp_email(to_email: str, name: str, otp: str, purpose: str) -> None:
    """purpose is 'register' or 'reset'."""
    if purpose == "register":
        subject = f"{settings.SMTP_FROM_NAME} — verify your email"
        heading = "Verify your email to finish creating your account."
    else:
        subject = f"{settings.SMTP_FROM_NAME} — password reset code"
        heading = "Use this code to reset your password."

    body = (
        f"Hello {name or ''},\n\n"
        f"{heading}\n\n"
        f"Your verification code is: {otp}\n\n"
        f"This code expires in {settings.OTP_EXPIRE_MINUTES} minutes. "
        "If you did not request this, you can safely ignore this email.\n\n"
        f"— {settings.SMTP_FROM_NAME}"
    )
    send_email(to_email, subject, body)
