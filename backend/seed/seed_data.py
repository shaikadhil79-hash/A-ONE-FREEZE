import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app import app
from extensions import db
from models import Appliance, CustomerProfile, Service, Technician, User, UserRole


def seed():
    with app.app_context():
        appliances = {
            "Air Conditioner": "Split, window and common residential AC services.",
            "Air Cooler": "Residential air cooler service and repair.",
            "Refrigerator": "Domestic refrigerator service and repair.",
            "Washing Machine": "Domestic washing machine service and repair.",
            "Water Heater": "Residential water heater/geyser services.",
        }

        for name, description in appliances.items():
            appliance = Appliance.query.filter_by(name=name).first()
            if not appliance:
                appliance = Appliance(name=name, description=description)
                db.session.add(appliance)

        db.session.flush()

        services = [
            ("Air Conditioner", "AC General Service", "Standard AC inspection and general service.", 499, 90),
            ("Air Conditioner", "AC Repair", "AC fault diagnosis and repair service.", 299, 90),
            ("Air Conditioner", "AC Installation", "Residential AC installation service.", 1499, 120),
            ("Air Conditioner", "AC Gas Refill", "AC refrigerant/gas refill service.", 2499, 120),
            ("Air Conditioner", "AC Deep Cleaning", "Deep cleaning for indoor and outdoor AC units.", 899, 120),
            ("Air Cooler", "Cooler General Service", "General air cooler cleaning and inspection.", 399, 60),
            ("Refrigerator", "Refrigerator Service", "General refrigerator inspection and service.", 499, 90),
            ("Washing Machine", "Washing Machine Service", "General washing machine inspection and service.", 499, 90),
            ("Water Heater", "Water Heater Service", "General geyser/water heater inspection and service.", 449, 75),
        ]

        for appliance_name, service_name, description, price, duration in services:
            appliance = Appliance.query.filter_by(name=appliance_name).one()
            existing = Service.query.filter_by(appliance_id=appliance.id, name=service_name).first()
            if not existing:
                db.session.add(Service(
                    appliance_id=appliance.id,
                    name=service_name,
                    description=description,
                    price=price,
                    estimated_duration_minutes=duration,
                ))

        customer_email = "customer.demo@aonefreeze.local"
        if not User.query.filter_by(email=customer_email).first():
            customer_user = User(email=customer_email, role=UserRole.CUSTOMER)
            customer_user.set_password("Customer@123")
            customer_user.customer_profile = CustomerProfile(
                full_name="Demo Customer",
                phone="9000000001",
                address="Demo Street",
                landmark="Near Demo Landmark",
                city="Chennai",
                pincode="600001",
            )
            db.session.add(customer_user)

        technician_email = "technician.demo@aonefreeze.local"
        if not User.query.filter_by(email=technician_email).first():
            technician_user = User(email=technician_email, role=UserRole.TECHNICIAN)
            technician_user.set_password("Technician@123")
            technician_user.technician = Technician(
                full_name="Demo Technician",
                phone="9000000002",
                commission_due=0,
            )
            db.session.add(technician_user)

        db.session.commit()
        print("Seed completed.")
        print("Customer login: customer.demo@aonefreeze.local / Customer@123")
        print("Technician login: technician.demo@aonefreeze.local / Technician@123")


if __name__ == "__main__":
    seed()
