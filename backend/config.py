import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


def _database_url() -> str:
    url = os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError(
            "DATABASE_URL is missing. Copy .env.example to .env and configure PostgreSQL."
        )
    return url


class Config:
    SQLALCHEMY_DATABASE_URI = _database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    if not JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY is missing from environment variables.")

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        minutes=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_MINUTES", "60"))
    )

    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    PAYMENT_SECRET_KEY = os.getenv("PAYMENT_SECRET_KEY", "")

    JSON_SORT_KEYS = False
