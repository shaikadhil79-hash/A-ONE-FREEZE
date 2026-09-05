"""Add technician date of birth

Revision ID: 950db9da0c2a
Revises: b7e1f0c4d2a9
"""

from alembic import op
import sqlalchemy as sa


revision = "950db9da0c2a"
down_revision = "b7e1f0c4d2a9"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "technicians",
        sa.Column(
            "date_of_birth",
            sa.Date(),
            nullable=True,
        ),
    )


def downgrade():
    op.drop_column("technicians", "date_of_birth")