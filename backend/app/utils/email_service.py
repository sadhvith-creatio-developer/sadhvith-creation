"""
Brevo email service for Sadhvith Creation.

Used for:
- Registration email verification
- Password reset OTP

Features:
- Clean responsive HTML email
- White and orange theme
- OTP verification code
- Visit website button
- Help / Contact Us button
- Plain-text fallback
- Brevo Async API
"""

import html
import logging

from brevo import AsyncBrevo
from brevo.transactional_emails import (
    SendTransacEmailRequestSender,
    SendTransacEmailRequestToItem,
)

from app.config import settings


logger = logging.getLogger("sadhvith.email")


# ============================================================
# WEBSITE URLS
# ============================================================

# Customer frontend
SITE_URL = "https://sadhvith-creation.vercel.app"

# Customer contact page
CONTACT_URL = f"{SITE_URL}/contact"


# ============================================================
# HTML ESCAPE HELPER
# ============================================================

def _safe(value: object) -> str:
    """
    Safely escape dynamic values before inserting them into HTML.
    """
    return html.escape(str(value or ""))


# ============================================================
# BUILD OTP HTML EMAIL
# ============================================================

def build_otp_email(
    name: str,
    otp: str,
    heading: str,
    purpose_text: str,
) -> str:
    """
    Build the complete HTML OTP email.
    """

    from_name = getattr(
        settings,
        "BREVO_FROM_NAME",
        "Sadhvith Creation",
    )

    expire_minutes = getattr(
        settings,
        "OTP_EXPIRE_MINUTES",
        10,
    )

    safe_name = _safe(name or "there")
    safe_otp = _safe(otp)
    safe_heading = _safe(heading)
    safe_purpose_text = _safe(purpose_text)
    safe_from_name = _safe(from_name)
    safe_expire_minutes = _safe(expire_minutes)

    return f"""<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <meta
        name="color-scheme"
        content="light"
    >

    <meta
        name="supported-color-schemes"
        content="light"
    >

    <title>
        {safe_from_name}
    </title>

</head>


<body
    style="
        margin:0;
        padding:0;
        width:100%;
        background-color:#f5f5f5;
        font-family:Arial, Helvetica, sans-serif;
        color:#1f2937;
    "
>


<!-- ========================================================= -->
<!-- OUTER BACKGROUND -->
<!-- ========================================================= -->

<table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        width:100%;
        margin:0;
        padding:0;
        background-color:#f5f5f5;
    "
>

    <tr>

        <td
            align="center"
            style="
                padding:35px 15px;
            "
        >


            <!-- ================================================= -->
            <!-- MAIN EMAIL CARD -->
            <!-- ================================================= -->

            <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                    width:100%;
                    max-width:560px;
                    background-color:#ffffff;
                    border:1px solid #e5e7eb;
                    border-radius:14px;
                    overflow:hidden;
                "
            >


                <!-- ============================================= -->
                <!-- ORANGE TOP BORDER -->
                <!-- ============================================= -->

                <tr>

                    <td
                        style="
                            height:5px;
                            background-color:#F97316;
                            font-size:0;
                            line-height:0;
                        "
                    >
                        &nbsp;
                    </td>

                </tr>


                <!-- ============================================= -->
                <!-- BRAND HEADER -->
                <!-- ============================================= -->

                <tr>

                    <td
                        align="center"
                        style="
                            padding:30px 25px 24px;
                        "
                    >

                        <div
                            style="
                                font-size:26px;
                                line-height:34px;
                                font-weight:bold;
                                color:#111827;
                            "
                        >
                            Sadhvith
                            <span style="color:#F97316;">
                                Creation
                            </span>
                        </div>


                        <div
                            style="
                                margin-top:7px;
                                font-size:11px;
                                line-height:18px;
                                color:#9ca3af;
                                letter-spacing:1px;
                            "
                        >
                            THOUGHTFULLY DESIGNED PRODUCTS
                        </div>

                    </td>

                </tr>


                <!-- ============================================= -->
                <!-- DIVIDER -->
                <!-- ============================================= -->

                <tr>

                    <td
                        style="
                            padding:0 30px;
                        "
                    >

                        <div
                            style="
                                height:1px;
                                background-color:#eeeeee;
                                font-size:0;
                                line-height:0;
                            "
                        >
                            &nbsp;
                        </div>

                    </td>

                </tr>


                <!-- ============================================= -->
                <!-- MAIN CONTENT -->
                <!-- ============================================= -->

                <tr>

                    <td
                        style="
                            padding:34px 30px 25px;
                        "
                    >


                        <!-- GREETING -->

                        <div
                            style="
                                font-size:15px;
                                line-height:24px;
                                color:#374151;
                                margin-bottom:12px;
                            "
                        >
                            Hello {safe_name},
                        </div>


                        <!-- HEADING -->

                        <div
                            style="
                                font-size:24px;
                                line-height:32px;
                                font-weight:bold;
                                color:#111827;
                                margin-bottom:12px;
                            "
                        >
                            {safe_heading}
                        </div>


                        <!-- DESCRIPTION -->

                        <div
                            style="
                                font-size:14px;
                                line-height:23px;
                                color:#6b7280;
                                margin-bottom:28px;
                            "
                        >
                            {safe_purpose_text}
                        </div>


                        <!-- OTP LABEL -->

                        <div
                            style="
                                text-align:center;
                                font-size:12px;
                                line-height:18px;
                                font-weight:bold;
                                letter-spacing:1px;
                                color:#9ca3af;
                                text-transform:uppercase;
                                margin-bottom:10px;
                            "
                        >
                            Your Verification Code
                        </div>


                        <!-- OTP BOX -->

                        <table
                            role="presentation"
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                width:100%;
                                background-color:#fff7ed;
                                border:1px solid #fed7aa;
                                border-radius:12px;
                            "
                        >

                            <tr>

                                <td
                                    align="center"
                                    style="
                                        padding:20px 15px;
                                    "
                                >

                                    <div
                                        style="
                                            font-size:32px;
                                            line-height:40px;
                                            font-weight:bold;
                                            letter-spacing:7px;
                                            color:#F97316;
                                        "
                                    >
                                        {safe_otp}
                                    </div>

                                </td>

                            </tr>

                        </table>


                        <!-- EXPIRY MESSAGE -->

                        <div
                            style="
                                text-align:center;
                                font-size:13px;
                                line-height:21px;
                                color:#6b7280;
                                margin-top:20px;
                                margin-bottom:25px;
                            "
                        >

                            This code expires in

                            <strong
                                style="
                                    color:#374151;
                                "
                            >
                                {safe_expire_minutes} minutes
                            </strong>.

                        </div>


                        <!-- ========================================= -->
                        <!-- SECURITY NOTICE -->
                        <!-- ========================================= -->

                        <table
                            role="presentation"
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                width:100%;
                                background-color:#fafafa;
                                border:1px solid #eeeeee;
                                border-radius:10px;
                            "
                        >

                            <tr>

                                <td
                                    style="
                                        padding:15px 16px;
                                    "
                                >

                                    <div
                                        style="
                                            font-size:13px;
                                            line-height:20px;
                                            color:#6b7280;
                                        "
                                    >

                                        <strong
                                            style="
                                                color:#374151;
                                            "
                                        >
                                            Security notice:
                                        </strong>

                                        Never share this verification
                                        code with anyone.

                                        If you did not request this
                                        code, you can safely ignore
                                        this email.

                                    </div>

                                </td>

                            </tr>

                        </table>


                    </td>

                </tr>


                <!-- ============================================= -->
                <!-- ABOUT COMPANY -->
                <!-- ============================================= -->

                <tr>

                    <td
                        style="
                            padding:0 30px 28px;
                        "
                    >

                        <div
                            style="
                                height:1px;
                                background-color:#eeeeee;
                                margin-bottom:25px;
                                font-size:0;
                                line-height:0;
                            "
                        >
                            &nbsp;
                        </div>


                        <div
                            style="
                                text-align:center;
                                font-size:16px;
                                line-height:24px;
                                font-weight:bold;
                                color:#111827;
                                margin-bottom:8px;
                            "
                        >
                            About Sadhvith Creation
                        </div>


                        <div
                            style="
                                text-align:center;
                                font-size:13px;
                                line-height:21px;
                                color:#6b7280;
                            "
                        >
                            Sadhvith Creation creates custom name
                            plates, personalized products and
                            thoughtfully designed creations with
                            attention to detail.
                        </div>

                    </td>

                </tr>


                <!-- ============================================= -->
                <!-- ACTION SECTION -->
                <!-- ============================================= -->

                <tr>

                    <td
                        align="center"
                        style="
                            padding:0 25px 32px;
                        "
                    >


                        <!-- HELP TEXT -->

                        <div
                            style="
                                font-size:14px;
                                line-height:22px;
                                color:#6b7280;
                                margin-bottom:18px;
                            "
                        >
                            Need help or want to know more?
                        </div>


                        <!-- BUTTON TABLE -->

                        <table
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                        >

                            <tr>


                                <!-- ================================= -->
                                <!-- VISIT WEBSITE BUTTON -->
                                <!-- ================================= -->

                                <td
                                    align="center"
                                    style="
                                        padding:0 5px;
                                    "
                                >

                                    <table
                                        role="presentation"
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                    >

                                        <tr>

                                            <td
                                                align="center"
                                                bgcolor="#F97316"
                                                style="
                                                    background-color:#F97316;
                                                    border-radius:8px;
                                                "
                                            >

                                                <a
                                                    href="https://sadhvith-creation.vercel.app/"
                                                    target="_blank"
                                                    style="
                                                        display:inline-block;
                                                        padding:12px 20px;
                                                        background-color:#F97316;
                                                        color:#ffffff;
                                                        text-decoration:none;
                                                        font-family:Arial, Helvetica, sans-serif;
                                                        font-size:13px;
                                                        line-height:20px;
                                                        font-weight:bold;
                                                        border-radius:8px;
                                                    "
                                                >
                                                    Visit Sadhvith Creation
                                                </a>

                                            </td>

                                        </tr>

                                    </table>

                                </td>


                                <!-- ================================= -->
                                <!-- CONTACT BUTTON -->
                                <!-- ================================= -->

                                <td
                                    align="center"
                                    style="
                                        padding:0 5px;
                                    "
                                >

                                    <table
                                        role="presentation"
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                    >

                                        <tr>

                                            <td
                                                align="center"
                                                bgcolor="#ffffff"
                                                style="
                                                    background-color:#ffffff;
                                                    border:1px solid #F97316;
                                                    border-radius:8px;
                                                "
                                            >

                                                <a
                                                    href="https://sadhvith-creation.vercel.app/contact"
                                                    target="_blank"
                                                    style="
                                                        display:inline-block;
                                                        padding:11px 20px;
                                                        background-color:#ffffff;
                                                        color:#F97316;
                                                        text-decoration:none;
                                                        font-family:Arial, Helvetica, sans-serif;
                                                        font-size:13px;
                                                        line-height:20px;
                                                        font-weight:bold;
                                                        border-radius:8px;
                                                    "
                                                >
                                                    Help / Contact Us
                                                </a>

                                            </td>

                                        </tr>

                                    </table>

                                </td>


                            </tr>

                        </table>


                    </td>

                </tr>


                <!-- ============================================= -->
                <!-- FOOTER -->
                <!-- ============================================= -->

                <tr>

                    <td
                        align="center"
                        style="
                            padding:24px 25px 28px;
                            background-color:#fffaf5;
                            border-top:1px solid #f3f4f6;
                        "
                    >


                        <!-- COPYRIGHT -->

                        <div
                            style="
                                font-size:12px;
                                line-height:20px;
                                color:#9ca3af;
                            "
                        >
                            © 2026 {safe_from_name}
                        </div>


                        <!-- LOCATION -->

                        <div
                            style="
                                font-size:12px;
                                line-height:20px;
                                color:#9ca3af;
                            "
                        >
                            Bengaluru, Karnataka, India
                        </div>


                        <!-- WEBSITE -->

                        <div
                            style="
                                margin-top:6px;
                                font-size:12px;
                                line-height:20px;
                            "
                        >

                            <a
                                href="https://sadhvith-creation.vercel.app/"
                                target="_blank"
                                style="
                                    color:#F97316;
                                    text-decoration:none;
                                    font-weight:bold;
                                "
                            >
                                sadhvith-creation.vercel.app
                            </a>

                        </div>


                    </td>

                </tr>


            </table>

            <!-- END EMAIL CARD -->


        </td>

    </tr>

</table>

<!-- END OUTER BACKGROUND -->


</body>
</html>
"""


# ============================================================
# SEND EMAIL THROUGH BREVO
# ============================================================

async def send_email(
    to_email: str,
    subject: str,
    body: str,
    html_content: str | None = None,
) -> None:
    """
    Send an email through Brevo.

    Plain-text content is always included.
    HTML content is included when available.
    """

    if not settings.BREVO_API_KEY:
        raise RuntimeError(
            "BREVO_API_KEY is not configured."
        )

    client = AsyncBrevo(
        api_key=settings.BREVO_API_KEY,
    )

    try:

        request_kwargs = {
            "sender": SendTransacEmailRequestSender(
                email=settings.BREVO_FROM_EMAIL,
                name=settings.BREVO_FROM_NAME,
            ),
            "to": [
                SendTransacEmailRequestToItem(
                    email=to_email,
                )
            ],
            "subject": subject,
            "text_content": body,
        }

        # Add HTML version when available.
        if html_content:
            request_kwargs["html_content"] = html_content

        result = await client.transactional_emails.send_transac_email(
            **request_kwargs,
        )

        logger.info(
            "Email sent successfully to %s. Brevo message ID: %s",
            to_email,
            getattr(result, "message_id", None),
        )

    except Exception as exc:

        logger.error(
            "Failed to send email to %s: %s",
            to_email,
            exc,
        )

        raise


# ============================================================
# SEND OTP EMAIL
# ============================================================

async def send_otp_email(
    to_email: str,
    name: str,
    otp: str,
    purpose: str,
) -> None:
    """
    Send OTP for registration or password reset.
    """

    # ========================================================
    # REGISTRATION
    # ========================================================

    if purpose == "register":

        subject = (
            f"{settings.BREVO_FROM_NAME} — Verify your email"
        )

        heading = "Verify Your Email"

        purpose_text = (
            "Use the verification code below to complete "
            "your Sadhvith Creation account registration."
        )


    # ========================================================
    # PASSWORD RESET
    # ========================================================

    elif purpose == "reset":

        subject = (
            f"{settings.BREVO_FROM_NAME} — Password reset code"
        )

        heading = "Reset Your Password"

        purpose_text = (
            "Use the verification code below to reset "
            "your Sadhvith Creation account password."
        )


    # ========================================================
    # INVALID PURPOSE
    # ========================================================

    else:

        raise ValueError(
            f"Unsupported email purpose: {purpose}"
        )


    # ========================================================
    # PLAIN TEXT VERSION
    # ========================================================

    plain_body = (
        f"Hello {name or 'there'},\n\n"
        f"{purpose_text}\n\n"
        f"Your verification code is: {otp}\n\n"
        f"This code expires in "
        f"{settings.OTP_EXPIRE_MINUTES} minutes.\n\n"
        "Never share this code with anyone.\n\n"
        "If you did not request this code, "
        "you can safely ignore this email.\n\n"
        f"Visit Sadhvith Creation: {SITE_URL}\n"
        f"Help / Contact Us: {CONTACT_URL}\n\n"
        f"— {settings.BREVO_FROM_NAME}"
    )


    # ========================================================
    # HTML VERSION
    # ========================================================

    html_body = build_otp_email(
        name=name,
        otp=otp,
        heading=heading,
        purpose_text=purpose_text,
    )


    # ========================================================
    # SEND EMAIL
    # ========================================================

    await send_email(
        to_email=to_email,
        subject=subject,
        body=plain_body,
        html_content=html_body,
    )