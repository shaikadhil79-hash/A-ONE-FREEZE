"""Add technician parts and final billing fields to bookings."""

from alembic import op
import sqlalchemy as sa

revision = "c3f8d2a1b7e4"
down_revision = "950db9da0c2a"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("bookings", sa.Column("parts", sa.JSON(), nullable=True))
    op.add_column("bookings", sa.Column("parts_total", sa.Numeric(12, 2), nullable=True))
    op.add_column("bookings", sa.Column("final_amount", sa.Numeric(12, 2), nullable=True))

    op.execute("UPDATE bookings SET parts = '[]' WHERE parts IS NULL")
    op.execute("UPDATE bookings SET parts_total = 0 WHERE parts_total IS NULL")
    op.execute("UPDATE bookings SET final_amount = service_price WHERE final_amount IS NULL")

    op.alter_column("bookings", "parts", nullable=False, server_default=sa.text("'[]'"))
    op.alter_column("bookings", "parts_total", nullable=False, server_default="0")
    op.alter_column("bookings", "final_amount", nullable=False, server_default="0")


def downgrade():
    op.drop_column("bookings", "final_amount")
    op.drop_column("bookings", "parts_total")
    op.drop_column("bookings", "parts")
