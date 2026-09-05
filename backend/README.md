# A-ONE FREEZE Backend Foundation

Flask + PostgreSQL + SQLAlchemy + JWT foundation for the existing React/Vite frontend.

## Current scope

Implemented:
- Flask application factory
- PostgreSQL connection through SQLAlchemy
- Flask-Migrate/Alembic integration
- JWT authentication
- Customer registration/login
- Technician registration/login
- Password hashing
- Customer profile persistence
- Technician commission/suspension fields for later service enforcement
- Appliance and Service models
- API health check
- CORS for the React/Vite frontend
- Seed data

Not implemented yet:
- bookings
- technician job acceptance rules
- start/end OTP
- payments
- commission payment
- earnings
- incidents/admin routes
- reviews

Those should be added in the next increment so the backend is not built as disconnected/fake endpoints.
