from datetime import datetime, timezone
from enum import Enum
from uuid import uuid4

from extensions import db


class TechnicianVerificationStatus(str, Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"


class TechnicianDocumentType(str, Enum):
    SELFIE = "SELFIE"
    AADHAAR = "AADHAAR"
    PAN = "PAN"


technician_verification_status_enum = db.Enum(
    TechnicianVerificationStatus, name="technician_verification_status"
)


class Technician(db.Model):
    __tablename__ = "technicians"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id = db.Column(
        db.String(36), db.ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    full_name = db.Column(db.String(150), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    mobile_number = db.Column(db.String(20), nullable=False, unique=True, index=True)
    verification_status = db.Column(
        technician_verification_status_enum,
        nullable=False,
        default=TechnicianVerificationStatus.PENDING,
    )
    verification_remarks = db.Column(db.Text, nullable=True)
    verified_at = db.Column(db.DateTime(timezone=True), nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    is_online = db.Column(db.Boolean, nullable=False, default=False)
    is_suspended = db.Column(db.Boolean, nullable=False, default=False)
    suspension_until = db.Column(db.DateTime(timezone=True), nullable=True)
    commission_due = db.Column(db.Numeric(12, 2), nullable=False, default=0)
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    user = db.relationship("User", back_populates="technician")
    documents = db.relationship(
        "TechnicianDocument", back_populates="technician", cascade="all, delete-orphan"
    )
    bank_accounts = db.relationship(
        "TechnicianBankAccount", back_populates="technician", cascade="all, delete-orphan"
    )

    def sync_suspension(self) -> None:
        """Expire a temporary suspension based on server time, never a frontend timer."""
        now = datetime.now(timezone.utc)
        until = self.suspension_until
        if self.is_suspended and until is not None and until <= now:
            self.is_suspended = False
            self.suspension_until = None

    @property
    def can_go_online(self) -> bool:
        self.sync_suspension()
        return (
            self.is_active
            and not self.is_suspended
            and self.verification_status == TechnicianVerificationStatus.VERIFIED
            and self.commission_due is not None
            and self.commission_due <= 500
        )

    def to_dict(self) -> dict:
        self.sync_suspension()
        return {
            "id": self.id,
            "user_id": self.user_id,
            "full_name": self.full_name,
            "date_of_birth": (
            self.date_of_birth.isoformat()
            if self.date_of_birth
            else None
            ),
            "mobile_number": self.mobile_number,
            "verification_status": self.verification_status.value,
            "verification_remarks": self.verification_remarks,
            "verified_at": self.verified_at.isoformat() if self.verified_at else None,
            "is_active": self.is_active,
            "is_online": self.is_online,
            "is_suspended": self.is_suspended,
            "suspension_until": self.suspension_until.isoformat() if self.suspension_until else None,
            "commission_due": float(self.commission_due or 0),
            "can_go_online": self.can_go_online,
            "created_at": self.created_at.isoformat(),
        }


class TechnicianDocument(db.Model):
    __tablename__ = "technician_documents"
    __table_args__ = (
        db.UniqueConstraint("technician_id", "document_type", name="uq_technician_document_type"),
    )

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    technician_id = db.Column(
        db.String(36), db.ForeignKey("technicians.id", ondelete="CASCADE"), nullable=False, index=True
    )
    document_type = db.Column(
        db.Enum(TechnicianDocumentType, name="technician_document_type"), nullable=False
    )
    document_url = db.Column(db.Text, nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    technician = db.relationship("Technician", back_populates="documents")


class TechnicianBankAccount(db.Model):
    __tablename__ = "technician_bank_accounts"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    technician_id = db.Column(
        db.String(36), db.ForeignKey("technicians.id", ondelete="CASCADE"), nullable=False, index=True
    )
    account_number = db.Column(db.String(34), nullable=False)
    account_holder_name = db.Column(db.String(150), nullable=False)
    ifsc_code = db.Column(db.String(11), nullable=False)
    verification_status = db.Column(
        technician_verification_status_enum,
        nullable=False,
        default=TechnicianVerificationStatus.PENDING,
    )
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    technician = db.relationship("Technician", back_populates="bank_accounts")
