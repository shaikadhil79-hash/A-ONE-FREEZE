from uuid import uuid4

from extensions import db


class Appliance(db.Model):
    __tablename__ = "appliances"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    name = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    services = db.relationship(
        "Service", back_populates="appliance", cascade="all, delete-orphan", lazy=True
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "is_active": self.is_active,
        }
