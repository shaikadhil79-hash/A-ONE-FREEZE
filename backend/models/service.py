from decimal import Decimal
from uuid import uuid4

from extensions import db


class Service(db.Model):
    __tablename__ = "services"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    appliance_id = db.Column(
        db.String(36), db.ForeignKey("appliances.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Numeric(12, 2), nullable=False)
    estimated_duration_minutes = db.Column(db.Integer, nullable=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    appliance = db.relationship("Appliance", back_populates="services")

    __table_args__ = (
        db.UniqueConstraint("appliance_id", "name", name="uq_service_appliance_name"),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "appliance_id": self.appliance_id,
            "name": self.name,
            "description": self.description,
            "price": float(Decimal(self.price)),
            "estimated_duration_minutes": self.estimated_duration_minutes,
            "is_active": self.is_active,
        }
