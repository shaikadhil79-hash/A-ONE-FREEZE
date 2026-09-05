from uuid import uuid4

from extensions import db


class CustomerProfile(db.Model):
    __tablename__ = "customer_profiles"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id = db.Column(
        db.String(36), db.ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    full_name = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(20), nullable=False, unique=True, index=True)
    address = db.Column(db.Text, nullable=False)
    landmark = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=False)
    pincode = db.Column(db.String(10), nullable=False)
    latitude = db.Column(db.Numeric(10, 7), nullable=True)
    longitude = db.Column(db.Numeric(10, 7), nullable=True)

    user = db.relationship("User", back_populates="customer_profile")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "full_name": self.full_name,
            "phone": self.phone,
            "email": self.user.email if self.user else None,
            "address": self.address,
            "landmark": self.landmark,
            "city": self.city,
            "pincode": self.pincode,
            "latitude": float(self.latitude) if self.latitude is not None else None,
            "longitude": float(self.longitude) if self.longitude is not None else None,
        }
