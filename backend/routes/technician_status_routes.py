from flask import Blueprint, jsonify, request

from extensions import db
from models import (
    Technician,
    TechnicianVerificationStatus,
    UserRole,
)
from utils.jwt_utils import current_user, role_required


technician_status_bp = Blueprint(
    "technician_status",
    __name__,
    url_prefix="/api/technician"
)


@technician_status_bp.patch("/online-status")
@role_required(UserRole.TECHNICIAN)
def update_online_status():

    # Get authenticated user from JWT
    user = current_user()

    technician = Technician.query.filter_by(
        user_id=user.id
    ).first()

    if technician is None:
        return jsonify({
            "error": "NotFound",
            "message": "Technician account not found."
        }), 404


    # Get request body
    data = request.get_json() or {}

    is_online = data.get("is_online")


    # Validate boolean value
    if not isinstance(is_online, bool):
        return jsonify({
            "error": "ValidationError",
            "message": "is_online must be true or false."
        }), 400


    # ==========================================
    # GOING ONLINE
    # ==========================================

    if is_online:

        # Technician must be verified
        if (
            technician.verification_status
            != TechnicianVerificationStatus.VERIFIED
        ):
            return jsonify({
                "error": "Forbidden",
                "message": (
                    "Technician must be verified "
                    "before going online."
                )
            }), 403


        # Check suspension, active account,
        # commission limit, etc.
        if not technician.can_go_online:
            return jsonify({
                "error": "Forbidden",
                "message": (
                    "Technician is not eligible "
                    "to go online."
                )
            }), 403


    # ==========================================
    # UPDATE STATUS
    # ==========================================

    technician.is_online = is_online

    db.session.commit()


    return jsonify({
        "message": (
            "Technician is now online."
            if technician.is_online
            else "Technician is now offline."
        ),

        "is_online": technician.is_online,

        "can_go_online": technician.can_go_online,
    }), 200