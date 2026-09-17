"""
Central application configuration.

All values are read from environment variables (see .env.example).

Nothing sensitive is ever hardcoded here.
"""

import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


class Settings:

    # MongoDB Atlas
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    MONGODB_DB_NAME: str = os.getenv(
        "MONGODB_DB_NAME",
        "sadhvith_creation",
    )

    # JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRE_MINUTES: int = int(
        os.getenv("JWT_EXPIRE_MINUTES", "1440")
    )  # 24h

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = os.getenv(
        "CLOUDINARY_CLOUD_NAME",
        "",
    )
    CLOUDINARY_API_KEY: str = os.getenv(
        "CLOUDINARY_API_KEY",
        "",
    )
    CLOUDINARY_API_SECRET: str = os.getenv(
        "CLOUDINARY_API_SECRET",
        "",
    )

    # CORS / frontends
    FRONTEND_URL: str = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173",
    )

    MANAGER_FRONTEND_URL: str = os.getenv(
        "MANAGER_FRONTEND_URL",
        "http://localhost:5174",
    )

    ADMIN_FRONTEND_URL: str = os.getenv(
        "ADMIN_FRONTEND_URL",
        "http://localhost:5175",
    )

    # Email (Brevo)
    BREVO_API_KEY: str = os.getenv(
        "BREVO_API_KEY",
        "",
    )

    BREVO_FROM_EMAIL: str = os.getenv(
        "BREVO_FROM_EMAIL",
        "sadhvithcreationdeveloper@gmail.com",
    )

    BREVO_FROM_NAME: str = os.getenv(
        "BREVO_FROM_NAME",
        "SADHVITH CREATION",
    )

    # OTP (email verification + forgot password)
    OTP_EXPIRE_MINUTES: int = int(
        os.getenv("OTP_EXPIRE_MINUTES", "10")
    )

    OTP_MAX_ATTEMPTS: int = int(
        os.getenv("OTP_MAX_ATTEMPTS", "5")
    )

    OTP_RESEND_COOLDOWN_SECONDS: int = int(
        os.getenv("OTP_RESEND_COOLDOWN_SECONDS", "45")
    )

    # Server
    PORT: int = int(os.getenv("PORT", "8000"))
    ENV: str = os.getenv("ENV", "development")

    # WhatsApp
    WHATSAPP_NUMBER: str = os.getenv(
        "WHATSAPP_NUMBER",
        "919999999999",
    )

    # Uploads
    MAX_IMAGES_PER_PRODUCT: int = 5

    MAX_IMAGE_SIZE_MB: int = int(
        os.getenv("MAX_IMAGE_SIZE_MB", "5")
    )

    ALLOWED_IMAGE_TYPES = {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    }


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()