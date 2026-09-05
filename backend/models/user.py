from datetime import datetime, timezone
from enum import Enum
from uuid import uuid4

from werkzeug.security import check_password_hash, generate_password_hash

from extensions import db


class UserRole(str, Enum):
    CUSTOMER = "CUSTOMER"
    TECHNICIAN = "TECHNICIAN"
    ADMIN = "ADMIN"


class User(db.Model):
    __tablename__ = "users"
    __table_args__ = (
        db.CheckConstraint(
            "email IS NOT NULL OR phone IS NOT NULL", name="ck_users_email_or_phone"
        ),
    )

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(255), unique=True, nullable=True, index=True)
    phone = db.Column(db.String(20), unique=True, nullable=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(UserRole, name="user_role"), nullable=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    customer_profile = db.relationship(
        "CustomerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    technician = db.relationship(
        "Technician", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "phone": self.phone,
            "role": self.role.value,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
        }
