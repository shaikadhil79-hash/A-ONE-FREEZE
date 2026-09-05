from datetime import datetime, timezone
from uuid import uuid4

from extensions import db


class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    booking_code = db.Column(db.String(32), unique=True, nullable=False, index=True)

    customer_id = db.Column(
        db.String(36), db.ForeignKey("customer_profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    technician_id = db.Column(
        db.String(36), db.ForeignKey("technicians.id", ondelete="SET NULL"), nullable=True, index=True
    )
    service_id = db.Column(
        db.String(36), db.ForeignKey("services.id", ondelete="RESTRICT"), nullable=False, index=True
    )

    status = db.Column(db.String(30), nullable=False, default="PENDING", index=True)

    scheduled_start_at = db.Column(db.DateTime(timezone=True), nullable=True, index=True)
    scheduled_end_at = db.Column(db.DateTime(timezone=True), nullable=True)
    accepted_at = db.Column(db.DateTime(timezone=True), nullable=True)
    started_at = db.Column(db.DateTime(timezone=True), nullable=True)
    completed_at = db.Column(db.DateTime(timezone=True), nullable=True)
    duration_seconds = db.Column(db.Integer, nullable=True)

    start_otp_hash = db.Column(db.String(255), nullable=True)
    end_otp_hash = db.Column(db.String(255), nullable=True)

    service_address = db.Column(db.Text, nullable=False)
    service_landmark = db.Column(db.String(255), nullable=True)
    service_city = db.Column(db.String(100), nullable=False)
    service_pincode = db.Column(db.String(10), nullable=False)

    service_latitude = db.Column(db.Numeric(10, 7), nullable=True)
    service_longitude = db.Column(db.Numeric(10, 7), nullable=True)
    technician_latitude = db.Column(db.Numeric(10, 7), nullable=True)
    technician_longitude = db.Column(db.Numeric(10, 7), nullable=True)
    technician_location_updated_at = db.Column(db.DateTime(timezone=True), nullable=True)

    service_price = db.Column(db.Numeric(12, 2), nullable=False)

    # Technician-added materials. Financial totals are stored on the
    # booking so the final bill does not depend on frontend/localStorage.
    parts = db.Column(db.JSON, nullable=False, default=list)
    parts_total = db.Column(db.Numeric(12, 2), nullable=False, default=0)
    final_amount = db.Column(db.Numeric(12, 2), nullable=False, default=0)

    estimated_duration_minutes = db.Column(db.Integer, nullable=False)

    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    customer = db.relationship("CustomerProfile", backref="bookings")
    technician = db.relationship("Technician", backref="bookings")
    service = db.relationship("Service", backref="bookings")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "booking_code": self.booking_code,
            "customer_id": self.customer_id,
            "technician_id": self.technician_id,
            "service_id": self.service_id,
            "status": self.status,
            "scheduled_start_at": self.scheduled_start_at.isoformat() if self.scheduled_start_at else None,
            "scheduled_end_at": self.scheduled_end_at.isoformat() if self.scheduled_end_at else None,
            "accepted_at": self.accepted_at.isoformat() if self.accepted_at else None,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "duration_seconds": self.duration_seconds,
            "service_address": self.service_address,
            "service_landmark": self.service_landmark,
            "service_city": self.service_city,
            "service_pincode": self.service_pincode,
            "service_latitude": float(self.service_latitude) if self.service_latitude is not None else None,
            "service_longitude": float(self.service_longitude) if self.service_longitude is not None else None,
            "technician_latitude": float(self.technician_latitude) if self.technician_latitude is not None else None,
            "technician_longitude": float(self.technician_longitude) if self.technician_longitude is not None else None,
            "technician_location_updated_at": self.technician_location_updated_at.isoformat() if self.technician_location_updated_at else None,
            "service_price": float(self.service_price),
            "parts": self.parts or [],
            "parts_total": float(self.parts_total or 0),
            "final_amount": float(self.final_amount if self.final_amount is not None else (self.service_price or 0)),
            "estimated_duration_minutes": self.estimated_duration_minutes,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
