from datetime import datetime, timezone
from zoneinfo import ZoneInfo
import secrets

from flask import Blueprint, jsonify, request
from sqlalchemy import func
from werkzeug.security import check_password_hash, generate_password_hash

from extensions import db
from models import Booking, Technician, UserRole
from utils.jwt_utils import current_user, role_required


technician_booking_bp = Blueprint(
    "technician_booking",
    __name__,
    url_prefix="/api/technician",
)

IST = ZoneInfo("Asia/Kolkata")

SCHEDULE_BLOCKING_STATUSES = (
    "ACCEPTED",
    "ON_THE_WAY",
    "IN_PROGRESS",
)

COUNTED_FOR_DAILY_LIMIT_STATUSES = (
    "ACCEPTED",
    "ON_THE_WAY",
    "IN_PROGRESS",
    "COMPLETED",
    "PAID",
)


def _technician_for_current_user():
    user = current_user()

    if user is None:
        return None

    return Technician.query.filter_by(
        user_id=user.id
    ).first()


def _utc_now():
    return datetime.now(timezone.utc)


def _normalise_datetime(value):
    if value is None:
        return None

    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)

    return value


def _generate_otp():
    return f"{secrets.randbelow(1_000_000):06d}"


def _verify_otp(entered_otp, otp_hash):
    if not entered_otp or not otp_hash:
        return False

    return check_password_hash(
        otp_hash,
        entered_otp,
    )


def _save_new_otp():
    otp = _generate_otp()

    return (
        otp,
        generate_password_hash(otp),
    )


# ============================================================
# GET AVAILABLE BOOKINGS
# ============================================================

@technician_booking_bp.get("/bookings")
@role_required(UserRole.TECHNICIAN)
def get_available_bookings():

    technician = _technician_for_current_user()

    if technician is None:
        return jsonify({
            "error": "NotFound",
            "message": "Technician profile not found.",
        }), 404

    technician.sync_suspension()

    if not technician.is_active:
        return jsonify({
            "error": "Forbidden",
            "message": "Your technician account is inactive.",
        }), 403

    if technician.is_suspended:
        return jsonify({
            "error": "Forbidden",
            "message": "Your technician account is currently suspended.",
            "suspension_until": (
                technician.suspension_until.isoformat()
                if technician.suspension_until
                else None
            ),
        }), 403

    if not technician.can_go_online:
        return jsonify({
            "error": "NotEligible",
            "message": (
                "Your technician account is not eligible "
                "to receive work."
            ),
        }), 403

    bookings = (
        Booking.query
        .filter(
            Booking.status == "PENDING"
        )
        .order_by(
            Booking.scheduled_start_at.asc(),
            Booking.created_at.asc(),
        )
        .all()
    )

    return jsonify({
        "bookings": [
            booking.to_dict()
            for booking in bookings
        ],
    }), 200


# ============================================================
# ACCEPT BOOKING
# ============================================================

@technician_booking_bp.post(
    "/bookings/<string:booking_id>/accept"
)
@role_required(UserRole.TECHNICIAN)
def accept_booking(booking_id):

    technician = _technician_for_current_user()

    if technician is None:
        return jsonify({
            "error": "NotFound",
            "message": "Technician profile not found.",
        }), 404

    # Lock technician row.
    technician = (
        Technician.query
        .filter_by(id=technician.id)
        .with_for_update()
        .first()
    )

    technician.sync_suspension()

    if not technician.is_active:
        return jsonify({
            "error": "Forbidden",
            "message": "Your technician account is inactive.",
        }), 403

    if technician.is_suspended:
        return jsonify({
            "error": "Forbidden",
            "message": "Your technician account is currently suspended.",
        }), 403

    if technician.verification_status.value != "VERIFIED":
        return jsonify({
            "error": "Forbidden",
            "message": "Your technician account is not verified.",
        }), 403

    if not technician.is_online:
        return jsonify({
            "error": "Offline",
            "message": "Go online before accepting new work.",
        }), 409

    if (
        technician.commission_due is not None
        and technician.commission_due > 500
    ):
        return jsonify({
            "error": "CommissionDue",
            "message": (
                "You cannot accept new work while "
                "commission due is above ₹500."
            ),
            "commission_due": float(
                technician.commission_due
            ),
        }), 409

    booking = (
        Booking.query
        .filter_by(id=booking_id)
        .with_for_update()
        .first()
    )

    if booking is None:
        return jsonify({
            "error": "NotFound",
            "message": "Booking not found.",
        }), 404

    if booking.status != "PENDING":
        return jsonify({
            "error": "Conflict",
            "message": (
                "This booking is no longer "
                "available for acceptance."
            ),
            "status": booking.status,
        }), 409

    if (
        booking.scheduled_start_at is None
        or booking.scheduled_end_at is None
    ):
        return jsonify({
            "error": "ValidationError",
            "message": (
                "This booking does not have "
                "a valid scheduled time window."
            ),
        }), 400

    start = _normalise_datetime(
        booking.scheduled_start_at
    )

    end = _normalise_datetime(
        booking.scheduled_end_at
    )

    if end <= start:
        return jsonify({
            "error": "ValidationError",
            "message": (
                "The booking has an invalid "
                "scheduled time window."
            ),
        }), 400

    # ========================================================
    # MAXIMUM 3 JOBS PER DAY
    # ========================================================

    service_day = start.astimezone(IST).date()

    day_start = datetime.combine(
        service_day,
        datetime.min.time(),
        tzinfo=IST,
    ).astimezone(timezone.utc)

    day_end = datetime.combine(
        service_day,
        datetime.max.time(),
        tzinfo=IST,
    ).astimezone(timezone.utc)

    daily_count = (
        db.session.query(
            func.count(Booking.id)
        )
        .filter(
            Booking.technician_id == technician.id,
            Booking.scheduled_start_at >= day_start,
            Booking.scheduled_start_at <= day_end,
            Booking.status.in_(
                COUNTED_FOR_DAILY_LIMIT_STATUSES
            ),
        )
        .scalar()
    )

    if daily_count >= 3:
        return jsonify({
            "error": "DailyLimitReached",
            "message": (
                "You have already accepted "
                "the maximum of 3 jobs for this day."
            ),
            "accepted_jobs_today": int(
                daily_count
            ),
            "daily_limit": 3,
        }), 409

    # ========================================================
    # STRICT OVERLAP CHECK
    #
    # COMPLETED and PAID bookings do NOT block.
    # ========================================================

    overlapping = (
        Booking.query
        .filter(
            Booking.technician_id == technician.id,
            Booking.status.in_(
                SCHEDULE_BLOCKING_STATUSES
            ),
            Booking.scheduled_start_at < end,
            Booking.scheduled_end_at > start,
        )
        .order_by(
            Booking.scheduled_start_at.asc()
        )
        .first()
    )

    if overlapping is not None:

        existing_start = (
            _normalise_datetime(
                overlapping.scheduled_start_at
            )
            .astimezone(IST)
            .strftime("%I:%M %p")
        )

        existing_end = (
            _normalise_datetime(
                overlapping.scheduled_end_at
            )
            .astimezone(IST)
            .strftime("%I:%M %p")
        )

        return jsonify({
            "error": "ScheduleConflict",
            "message": (
                f"You already have a job from "
                f"{existing_start} to {existing_end}. "
                "Please complete or reschedule "
                "before accepting another."
            ),
            "conflicting_booking_id": overlapping.id,
            "conflicting_booking_code": (
                overlapping.booking_code
            ),
            "conflict_start": (
                overlapping.scheduled_start_at.isoformat()
            ),
            "conflict_end": (
                overlapping.scheduled_end_at.isoformat()
            ),
        }), 409

    # ========================================================
    # ACCEPT
    # ========================================================

    now = _utc_now()

    booking.technician_id = technician.id
    booking.status = "ACCEPTED"
    booking.accepted_at = now
    booking.updated_at = now

    db.session.commit()

    return jsonify({
        "message": "Booking accepted successfully.",
        "booking": booking.to_dict(),
    }), 200


# ============================================================
# UPDATE SERVICE PARTS / MATERIALS
#
# The server owns the financial calculation. The frontend sends
# only part names/prices; parts_total and final_amount are
# calculated here from the booking's base service price.
# ============================================================

@technician_booking_bp.put(
    "/bookings/<string:booking_id>/parts"
)
@role_required(UserRole.TECHNICIAN)
def update_booking_parts(booking_id):

    technician = _technician_for_current_user()

    if technician is None:
        return jsonify({
            "error": "NotFound",
            "message": "Technician profile not found.",
        }), 404

    technician.sync_suspension()

    if technician.is_suspended:
        return jsonify({
            "error": "Forbidden",
            "message": "Your technician account is currently suspended.",
            "suspension_until": (
                technician.suspension_until.isoformat()
                if technician.suspension_until else None
            ),
        }), 403

    if not technician.is_online:
        return jsonify({
            "error": "Offline",
            "message": "Go online before updating service work.",
        }), 409

    if technician.commission_due is not None and technician.commission_due > 500:
        return jsonify({
            "error": "CommissionDue",
            "message": "You cannot perform service work while commission due is above ₹500.",
            "commission_due": float(technician.commission_due),
        }), 409

    booking = (
        Booking.query
        .filter_by(id=booking_id, technician_id=technician.id)
        .with_for_update()
        .first()
    )

    if booking is None:
        return jsonify({
            "error": "NotFound",
            "message": "Booking not found.",
        }), 404

    if booking.status != "IN_PROGRESS":
        return jsonify({
            "error": "InvalidStatus",
            "message": "Parts can only be updated while the service is in progress.",
            "status": booking.status,
        }), 409

    payload = request.get_json(silent=True) or {}
    raw_parts = payload.get("parts", [])

    if not isinstance(raw_parts, list):
        return jsonify({
            "error": "ValidationError",
            "message": "parts must be an array.",
        }), 400

    clean_parts = []
    parts_total = 0.0

    for index, item in enumerate(raw_parts):
        if not isinstance(item, dict):
            return jsonify({
                "error": "ValidationError",
                "message": f"Part {index + 1} must be an object.",
            }), 400

        name = str(item.get("name", "")).strip()
        raw_price = item.get("price", item.get("amount"))

        if not name:
            return jsonify({
                "error": "ValidationError",
                "message": f"Part {index + 1} name is required.",
            }), 400

        try:
            price = float(raw_price)
        except (TypeError, ValueError):
            return jsonify({
                "error": "ValidationError",
                "message": f"Part {index + 1} price must be a valid number.",
            }), 400

        if price < 0:
            return jsonify({
                "error": "ValidationError",
                "message": f"Part {index + 1} price cannot be negative.",
            }), 400

        clean_parts.append({
            "id": str(item.get("id") or secrets.token_hex(8)),
            "name": name,
            "price": round(price, 2),
        })
        parts_total += price

    parts_total = round(parts_total, 2)
    final_amount = round(float(booking.service_price) + parts_total, 2)
    now = _utc_now()

    booking.parts = clean_parts
    booking.parts_total = parts_total
    booking.final_amount = final_amount
    booking.updated_at = now

    db.session.commit()

    return jsonify({
        "message": "Service parts updated successfully.",
        "booking": booking.to_dict(),
        "service_price": float(booking.service_price),
        "parts_total": parts_total,
        "final_amount": final_amount,
    }), 200


# ============================================================
# VERIFY START OTP
#
# ACCEPTED → IN_PROGRESS
# started_at is ALWAYS server time.
# ============================================================

@technician_booking_bp.post(
    "/bookings/<string:booking_id>/verify-start-otp"
)
@role_required(UserRole.TECHNICIAN)
def verify_start_otp(booking_id):

    technician = _technician_for_current_user()

    if technician is None:
        return jsonify({
            "error": "NotFound",
            "message": "Technician profile not found.",
        }), 404

    booking = Booking.query.filter_by(
        id=booking_id,
        technician_id=technician.id,
    ).with_for_update().first()

    if booking is None:
        return jsonify({
            "error": "NotFound",
            "message": "Booking not found.",
        }), 404

    if booking.status not in (
        "ACCEPTED",
        "ON_THE_WAY",
    ):
        return jsonify({
            "error": "InvalidStatus",
            "message": (
                "Start OTP can only be verified "
                "for an accepted job."
            ),
            "status": booking.status,
        }), 409

    data = request.get_json(
        silent=True
    ) or {}

    otp = str(
        data.get("otp", "")
    ).strip()

    if len(otp) != 6 or not otp.isdigit():
        return jsonify({
            "error": "ValidationError",
            "message": (
                "Please enter the 6-digit Start OTP."
            ),
        }), 400

    if not _verify_otp(
        otp,
        booking.start_otp_hash,
    ):
        return jsonify({
            "error": "InvalidOTP",
            "message": (
                "Incorrect Start OTP. "
                "Please ask the customer for "
                "the correct OTP."
            ),
        }), 401

    # If already started, return current state.
    if booking.started_at is not None:
        return jsonify({
            "message": "Service has already started.",
            "booking": booking.to_dict(),
        }), 200

    now = _utc_now()

    booking.status = "IN_PROGRESS"
    booking.started_at = now
    booking.updated_at = now

    # --------------------------------------------------------
    # Generate End OTP if one does not exist.
    #
    # IMPORTANT:
    # The generated plaintext OTP is returned ONCE here.
    # The customer application should receive/store/display
    # this as the customer's End OTP.
    # --------------------------------------------------------

    end_otp = None

    if not booking.end_otp_hash:
        end_otp, end_otp_hash = _save_new_otp()
        booking.end_otp_hash = end_otp_hash

    db.session.commit()

    response = {
        "message": (
            "Start OTP verified. "
            "Service is now in progress."
        ),
        "booking": booking.to_dict(),
        "started_at": booking.started_at.isoformat(),
        "server_time": now.isoformat(),
    }

    if end_otp is not None:
        response["end_otp"] = end_otp
        response["end_otp_message"] = (
            "Give this End OTP to the customer. "
            "It is required to complete the service."
        )

    return jsonify(response), 200


# ============================================================
# VERIFY END OTP
#
# IN_PROGRESS → COMPLETED
# completed_at is ALWAYS server time.
# duration = completed_at - started_at
# ============================================================

@technician_booking_bp.post(
    "/bookings/<string:booking_id>/verify-end-otp"
)
@role_required(UserRole.TECHNICIAN)
def verify_end_otp(booking_id):

    technician = _technician_for_current_user()

    if technician is None:
        return jsonify({
            "error": "NotFound",
            "message": "Technician profile not found.",
        }), 404

    booking = Booking.query.filter_by(
        id=booking_id,
        technician_id=technician.id,
    ).with_for_update().first()

    if booking is None:
        return jsonify({
            "error": "NotFound",
            "message": "Booking not found.",
        }), 404

    if booking.status != "IN_PROGRESS":
        return jsonify({
            "error": "InvalidStatus",
            "message": (
                "End OTP can only be verified "
                "while the service is in progress."
            ),
            "status": booking.status,
        }), 409

    if booking.started_at is None:
        return jsonify({
            "error": "InvalidState",
            "message": (
                "This service does not have "
                "a valid start time."
            ),
        }), 409

    data = request.get_json(
        silent=True
    ) or {}

    otp = str(
        data.get("otp", "")
    ).strip()

    if len(otp) != 6 or not otp.isdigit():
        return jsonify({
            "error": "ValidationError",
            "message": (
                "Please enter the 6-digit End OTP."
            ),
        }), 400

    if not _verify_otp(
        otp,
        booking.end_otp_hash,
    ):
        return jsonify({
            "error": "InvalidOTP",
            "message": (
                "Incorrect End OTP. "
                "Please ask the customer for "
                "the correct OTP."
            ),
        }), 401

    now = _utc_now()

    started_at = _normalise_datetime(
        booking.started_at
    )

    duration_seconds = max(
        0,
        int(
            (
                now - started_at
            ).total_seconds()
        ),
    )

    booking.status = "COMPLETED"
    booking.completed_at = now
    booking.duration_seconds = duration_seconds
    booking.updated_at = now

    db.session.commit()

    return jsonify({
        "message": (
            "End OTP verified. "
            "Service completed successfully."
        ),
        "booking": booking.to_dict(),
        "started_at": started_at.isoformat(),
        "completed_at": now.isoformat(),
        "duration_seconds": duration_seconds,
        "duration_minutes": round(
            duration_seconds / 60,
            2,
        ),
        "service_price": float(booking.service_price),
        "parts": booking.parts or [],
        "parts_total": float(booking.parts_total or 0),
        "final_amount": float(booking.final_amount if booking.final_amount is not None else booking.service_price),
        "server_time": now.isoformat(),
    }), 200


# ============================================================
# SERVICE STATUS
#
# Technician can refresh and get the authoritative timer data.
# ============================================================

@technician_booking_bp.get(
    "/bookings/<string:booking_id>/service-status"
)
@role_required(UserRole.TECHNICIAN)
def get_service_status(booking_id):

    technician = _technician_for_current_user()

    if technician is None:
        return jsonify({
            "error": "NotFound",
            "message": "Technician profile not found.",
        }), 404

    booking = Booking.query.filter_by(
        id=booking_id,
        technician_id=technician.id,
    ).first()

    if booking is None:
        return jsonify({
            "error": "NotFound",
            "message": "Booking not found.",
        }), 404

    now = _utc_now()

    elapsed_seconds = 0

    if booking.started_at:

        started_at = _normalise_datetime(
            booking.started_at
        )

        if booking.completed_at:

            completed_at = _normalise_datetime(
                booking.completed_at
            )

            elapsed_seconds = max(
                0,
                int(
                    (
                        completed_at
                        - started_at
                    ).total_seconds()
                ),
            )

        elif booking.status == "IN_PROGRESS":

            elapsed_seconds = max(
                0,
                int(
                    (
                        now
                        - started_at
                    ).total_seconds()
                ),
            )

    return jsonify({
        "booking": booking.to_dict(),
        "status": booking.status,
        "server_time": now.isoformat(),
        "started_at": (
            booking.started_at.isoformat()
            if booking.started_at
            else None
        ),
        "completed_at": (
            booking.completed_at.isoformat()
            if booking.completed_at
            else None
        ),
        "elapsed_seconds": elapsed_seconds,
        "duration_seconds": (
            booking.duration_seconds
            if booking.duration_seconds is not None
            else elapsed_seconds
        ),
        "is_running": (
            booking.status == "IN_PROGRESS"
            and booking.completed_at is None
        ),
    }), 200