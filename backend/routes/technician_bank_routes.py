from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import Technician, TechnicianBankAccount


technician_bank_bp = Blueprint(
    "technician_bank",
    __name__,
    url_prefix="/api/technician"
)


def _get_technician_from_token():
    user_id = get_jwt_identity()

    return Technician.query.filter_by(
        user_id=user_id
    ).first()


@technician_bank_bp.post("/bank-account")
@jwt_required()
def add_bank_account():

    technician = _get_technician_from_token()

    if technician is None:
        return jsonify({
            "error": "NotFound",
            "message": "Technician account not found."
        }), 404

    if not technician.is_active:
        return jsonify({
            "error": "Forbidden",
            "message": "Technician account is inactive."
        }), 403

    payload = request.get_json(silent=True) or {}

    required_fields = [
        "account_number",
        "account_holder_name",
        "ifsc_code",
    ]

    missing = [
        field
        for field in required_fields
        if not payload.get(field)
    ]

    if missing:
        return jsonify({
            "error": "ValidationError",
            "message": "Missing required bank account fields.",
            "fields": missing,
        }), 400

    account_number = str(
        payload["account_number"]
    ).strip()

    account_holder_name = str(
        payload["account_holder_name"]
    ).strip()

    ifsc_code = str(
        payload["ifsc_code"]
    ).strip().upper()

    # ---------------------------------------------------------
    # Basic validation
    # ---------------------------------------------------------

    if not account_number.isdigit():
        return jsonify({
            "error": "ValidationError",
            "message": "Account number must contain digits only."
        }), 400

    if not 8 <= len(account_number) <= 34:
        return jsonify({
            "error": "ValidationError",
            "message": "Account number must be between 8 and 34 digits."
        }), 400

    if not account_holder_name:
        return jsonify({
            "error": "ValidationError",
            "message": "Account holder name is required."
        }), 400

    # Indian IFSC format:
    # 4 letters + 0 + 6 alphanumeric characters
    if (
        len(ifsc_code) != 11
        or not ifsc_code[:4].isalpha()
        or ifsc_code[4] != "0"
        or not ifsc_code[5:].isalnum()
    ):
        return jsonify({
            "error": "ValidationError",
            "message": "Invalid IFSC code."
        }), 400

    # ---------------------------------------------------------
    # Check whether technician already has a bank account
    # ---------------------------------------------------------

    existing_account = TechnicianBankAccount.query.filter_by(
        technician_id=technician.id
    ).first()

    if existing_account:
        return jsonify({
            "error": "Conflict",
            "message": "Technician bank account already exists."
        }), 409

    # ---------------------------------------------------------
    # Create bank account
    # ---------------------------------------------------------

    bank_account = TechnicianBankAccount(
        technician_id=technician.id,
        account_number=account_number,
        account_holder_name=account_holder_name,
        ifsc_code=ifsc_code,
    )

    db.session.add(bank_account)
    db.session.commit()

    return jsonify({
        "message": "Bank account added successfully.",
        "bank_account": {
            "id": bank_account.id,
            "account_number": bank_account.account_number,
            "account_holder_name": bank_account.account_holder_name,
            "ifsc_code": bank_account.ifsc_code,
            "verification_status": (
                bank_account.verification_status.value
                if hasattr(bank_account.verification_status, "value")
                else bank_account.verification_status
            ),
            "created_at": bank_account.created_at.isoformat(),
        }
    }), 201