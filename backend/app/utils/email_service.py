"""
Resend email service used for OTP emails.

Used for:
- Registration email verification
- Password reset OTP
"""

import logging

import resend

from app.config import settings

logger = logging.getLogger("sadhvith.email")


async def send_email(
    to_email: str,
    subject: str,
    body: str,
) -> None:
    """Send an email using Resend."""

    if not settings.RESEND_API_KEY:
        raise RuntimeError(
            "RESEND_API_KEY is not configured."
        )

    resend.api_key = settings.RESEND_API_KEY

    params = {
        "from": (
            f"{settings.RESEND_FROM_NAME} "
            f"<{settings.RESEND_FROM_EMAIL}>"
        ),
        "to": [to_email],
        "subject": subject,
        "text": body,
    }

    try:
        result = await resend.Emails.send_async(params)

        logger.info(
            "Email sent successfully to %s. Resend ID: %s",
            to_email,
            getattr(result, "id", None),
        )

    except Exception as exc:
        logger.error(
            "Failed to send email to %s: %s",
            to_email,
            exc,
        )
        raise


async def send_otp_email(
    to_email: str,
    name: str,
    otp: str,
    purpose: str,
) -> None:
    """Send OTP for registration or password reset."""

    if purpose == "register":
        subject = (
            f"{settings.RESEND_FROM_NAME} — verify your email"
        )
        heading = (
            "Verify your email to finish creating your account."
        )

    elif purpose == "reset":
        subject = (
            f"{settings.RESEND_FROM_NAME} — password reset code"
        )
        heading = "Use this code to reset your password."

    else:
        raise ValueError(
            f"Unsupported email purpose: {purpose}"
        )

    body = (
        f"Hello {name or ''},\n\n"
        f"{heading}\n\n"
        f"Your verification code is: {otp}\n\n"
        f"This code expires in "
        f"{settings.OTP_EXPIRE_MINUTES} minutes. "
        "If you did not request this, "
        "you can safely ignore this email.\n\n"
        f"— {settings.RESEND_FROM_NAME}"
    )

    await send_email(
        to_email=to_email,
        subject=subject,
        body=body,
    )