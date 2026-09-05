"""Add bookings table for service jobs and server-controlled timing.

Revision ID: b7e1f0c4d2a9
Revises: 
"""

from alembic import op
import sqlalchemy as sa


revision = "b7e1f0c4d2a9"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "bookings",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("booking_code", sa.String(length=32), nullable=False),
        sa.Column("customer_id", sa.String(length=36), nullable=False),
        sa.Column("technician_id", sa.String(length=36), nullable=True),
        sa.Column("service_id", sa.String(length=36), nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("scheduled_start_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("scheduled_end_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("accepted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("duration_seconds", sa.Integer(), nullable=True),
        sa.Column("start_otp_hash", sa.String(length=255), nullable=True),
        sa.Column("end_otp_hash", sa.String(length=255), nullable=True),
        sa.Column("service_address", sa.Text(), nullable=False),
        sa.Column("service_landmark", sa.String(length=255), nullable=True),
        sa.Column("service_city", sa.String(length=100), nullable=False),
        sa.Column("service_pincode", sa.String(length=10), nullable=False),
        sa.Column("service_latitude", sa.Numeric(precision=10, scale=7), nullable=True),
        sa.Column("service_longitude", sa.Numeric(precision=10, scale=7), nullable=True),
        sa.Column("technician_latitude", sa.Numeric(precision=10, scale=7), nullable=True),
        sa.Column("technician_longitude", sa.Numeric(precision=10, scale=7), nullable=True),
        sa.Column("technician_location_updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("service_price", sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column("estimated_duration_minutes", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["customer_id"], ["customer_profiles.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["technician_id"], ["technicians.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["service_id"], ["services.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("booking_code"),
    )

    op.create_index("ix_bookings_booking_code", "bookings", ["booking_code"], unique=False)
    op.create_index("ix_bookings_customer_id", "bookings", ["customer_id"], unique=False)
    op.create_index("ix_bookings_technician_id", "bookings", ["technician_id"], unique=False)
    op.create_index("ix_bookings_service_id", "bookings", ["service_id"], unique=False)
    op.create_index("ix_bookings_status", "bookings", ["status"], unique=False)
    op.create_index("ix_bookings_scheduled_start_at", "bookings", ["scheduled_start_at"], unique=False)


def downgrade():
    op.drop_index("ix_bookings_scheduled_start_at", table_name="bookings")
    op.drop_index("ix_bookings_status", table_name="bookings")
    op.drop_index("ix_bookings_service_id", table_name="bookings")
    op.drop_index("ix_bookings_technician_id", table_name="bookings")
    op.drop_index("ix_bookings_customer_id", table_name="bookings")
    op.drop_index("ix_bookings_booking_code", table_name="bookings")
    op.drop_table("bookings")
