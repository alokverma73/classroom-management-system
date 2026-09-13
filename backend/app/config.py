import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    if not SECRET_KEY or not JWT_SECRET_KEY:
        raise RuntimeError(
            "SECRET_KEY and JWT_SECRET_KEY must be set in your .env file. "
            "See .env.example."
        )

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///classroom.db"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False