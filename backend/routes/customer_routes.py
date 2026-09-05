from datetime import datetime, timezone
import secrets

from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash

from extensions import db
from models import (
    Booking,
    CustomerProfile,
    Service,
    UserRole,
)
from utils.jwt_utils import current_user, role_required


customer_bp = Blueprint(
    "customer",
    __name__,
    url_prefix="/api/customer",
)


# ============================================================
# HELPERS
# ============================================================

def _generate_otp():
    """Generate a secure 6-digit OTP."""
    return f"{secrets.randbelow(1_000_000):06d}"


def _generate_booking_code():
    """Generate a unique booking code."""

    while True:
        number = secrets.randbelow(9_999_999)

        code = (
            f"AOF-{datetime.now(timezone.utc).year}"
            f"-{number:07d}"
        )

        if Booking.query.filter_by(
            booking_code=code
        ).first() is None:
            return code


def _parse_datetime(value):
    """Convert an ISO datetime into UTC."""

    if not value:
        return None

    try:
        parsed = datetime.fromisoformat(
            value.replace("Z", "+00:00")
        )
    except (TypeError, ValueError):
        return None

    if parsed.tzinfo is None:
        parsed = parsed.replace(
            tzinfo=timezone.utc
        )

    return parsed.astimezone(timezone.utc)


def _get_customer_profile():
    """Get the profile belonging to the logged-in customer."""

    user = current_user()

    if user is None:
        return None

    return CustomerProfile.query.filter_by(
        user_id=user.id
    ).first()


# ============================================================
# CUSTOMER PROFILE
# ============================================================

@customer_bp.get("/me")
@role_required(UserRole.CUSTOMER)
def get_customer_me():

    user = current_user()

    profile = CustomerProfile.query.filter_by(
        user_id=user.id
    ).first()

    if profile is None:
        return jsonify({
            "error": "NotFound",
            "message": "Customer profile not found.",
        }), 404

    return jsonify({
        "user": user.to_dict(),
        "profile": profile.to_dict(),
    }), 200


# ============================================================
# CREATE BOOKING
# ============================================================

@customer_bp.post("/bookings")
@role_required(UserRole.CUSTOMER)
def create_booking():

    profile = _get_customer_profile()

    if profile is None:
        return jsonify({
            "error": "NotFound",
            "message": "Customer profile not found.",
        }), 404

    payload = request.get_json(
        silent=True
    ) or {}

    # --------------------------------------------------------
    # SERVICE
    # --------------------------------------------------------

    service_id = payload.get("service_id")

    if not service_id:
        return jsonify({
            "error": "ValidationError",
            "message": "service_id is required.",
        }), 400

    service = Service.query.filter_by(
        id=service_id,
        is_active=True,
    ).first()

    if service is None:
        return jsonify({
            "error": "NotFound",
            "message": "Active service not found.",
        }), 404

    # --------------------------------------------------------
    # SCHEDULE
    # --------------------------------------------------------

    scheduled_start_at = _parse_datetime(
        payload.get("scheduled_start_at")
    )

    scheduled_end_at = _parse_datetime(
        payload.get("scheduled_end_at")
    )

    if scheduled_start_at is None:
        return jsonify({
            "error": "ValidationError",
            "message": (
                "scheduled_start_at is required "
                "and must be a valid ISO datetime."
            ),
        }), 400

    if scheduled_end_at is None:
        return jsonify({
            "error": "ValidationError",
            "message": (
                "scheduled_end_at is required "
                "and must be a valid ISO datetime."
            ),
        }), 400

    if scheduled_end_at <= scheduled_start_at:
        return jsonify({
            "error": "ValidationError",
            "message": (
                "scheduled_end_at must be after "
                "scheduled_start_at."
            ),
        }), 400

    # --------------------------------------------------------
    # SERVICE ADDRESS
    #
    # If the customer sends a different address,
    # use that. Otherwise use the saved profile address.
    # --------------------------------------------------------

    address = (
        payload.get("address")
        or profile.address
    )

    landmark = (
        payload.get("landmark")
        if payload.get("landmark") is not None
        else profile.landmark
    )

    city = (
        payload.get("city")
        or profile.city
    )

    pincode = (
        payload.get("pincode")
        or profile.pincode
    )

    latitude = (
        payload.get("latitude")
        if payload.get("latitude") is not None
        else profile.latitude
    )

    longitude = (
        payload.get("longitude")
        if payload.get("longitude") is not None
        else profile.longitude
    )

    if not address:
        return jsonify({
            "error": "ValidationError",
            "message": "Service address is required.",
        }), 400

    if not city:
        return jsonify({
            "error": "ValidationError",
            "message": "Service city is required.",
        }), 400

    if not pincode:
        return jsonify({
            "error": "ValidationError",
            "message": "Service pincode is required.",
        }), 400

    # --------------------------------------------------------
    # GENERATE UNIQUE OTP PAIR
    # --------------------------------------------------------

    start_otp = _generate_otp()
    end_otp = _generate_otp()

    # Start and End OTP must be different.
    while end_otp == start_otp:
        end_otp = _generate_otp()

    start_otp_hash = generate_password_hash(
        start_otp
    )

    end_otp_hash = generate_password_hash(
        end_otp
    )

    # --------------------------------------------------------
    # CREATE BOOKING
    # --------------------------------------------------------

    now = datetime.now(timezone.utc)

    booking = Booking(
        booking_code=_generate_booking_code(),

        customer_id=profile.id,

        service_id=service.id,

        status="PENDING",

        scheduled_start_at=scheduled_start_at,

        scheduled_end_at=scheduled_end_at,

        accepted_at=None,

        started_at=None,

        completed_at=None,

        duration_seconds=None,

        start_otp_hash=start_otp_hash,

        end_otp_hash=end_otp_hash,

        service_address=address,

        service_landmark=landmark,

        service_city=city,

        service_pincode=pincode,

        service_latitude=latitude,

        service_longitude=longitude,

        technician_latitude=None,

        technician_longitude=None,

        technician_location_updated_at=None,

        service_price=service.price,

        estimated_duration_minutes=(
            service.estimated_duration_minutes
        ),

        created_at=now,

        updated_at=now,
    )

    db.session.add(booking)
    db.session.commit()

    # --------------------------------------------------------
    # CUSTOMER RESPONSE
    #
    # Plain OTPs are returned ONLY at booking creation.
    # Hashes are NEVER returned.
    # --------------------------------------------------------

    response_booking = booking.to_dict()

    response_booking["service"] = service.to_dict()

    response_booking["start_otp"] = start_otp
    response_booking["end_otp"] = end_otp

    return jsonify({
        "message": "Booking created successfully.",
        "booking": response_booking,
        "security": {
            "start_otp_required": True,
            "end_otp_required": True,
            "message": (
                "Keep both OTPs private. "
                "Give the Start OTP when the technician "
                "is ready to begin. Give the End OTP "
                "when the service is finished."
            ),
        },
    }), 201


# ============================================================
# LIST CUSTOMER BOOKINGS
# ============================================================

@customer_bp.get("/bookings")
@role_required(UserRole.CUSTOMER)
def list_customer_bookings():

    profile = _get_customer_profile()

    if profile is None:
        return jsonify({
            "error": "NotFound",
            "message": "Customer profile not found.",
        }), 404

    bookings = (
        Booking.query
        .filter_by(
            customer_id=profile.id
        )
        .order_by(
            Booking.created_at.desc()
        )
        .all()
    )

    result = []

    for booking in bookings:

        item = booking.to_dict()

        item["service"] = (
            booking.service.to_dict()
            if booking.service
            else None
        )

        result.append(item)

    return jsonify({
        "bookings": result,
    }), 200


# ============================================================
# GET SINGLE CUSTOMER BOOKING
# ============================================================

@customer_bp.get(
    "/bookings/<string:booking_id>"
)
@role_required(UserRole.CUSTOMER)
def get_customer_booking(booking_id):

    profile = _get_customer_profile()

    if profile is None:
        return jsonify({
            "error": "NotFound",
            "message": "Customer profile not found.",
        }), 404

    booking = (
        Booking.query
        .filter_by(
            id=booking_id,
            customer_id=profile.id,
        )
        .first()
    )

    if booking is None:
        return jsonify({
            "error": "NotFound",
            "message": "Booking not found.",
        }), 404

    response = booking.to_dict()

    response["service"] = (
        booking.service.to_dict()
        if booking.service
        else None
    )

    return jsonify({
        "booking": response,
    }), 200