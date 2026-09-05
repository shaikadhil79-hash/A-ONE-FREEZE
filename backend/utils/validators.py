import re


def require_fields(payload: dict, fields: list[str]) -> list[str]:
    return [field for field in fields if not payload.get(field)]


def validate_email(email: str) -> bool:
    return bool(re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email or ""))


def validate_password(password: str) -> bool:
    return isinstance(password, str) and len(password) >= 8


def normalize_email(email: str) -> str:
    return email.strip().lower()


def normalize_phone(phone: str) -> str:
    return re.sub(r"\s+", "", phone.strip())
