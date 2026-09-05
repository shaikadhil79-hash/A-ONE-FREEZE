from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from extensions import db
from models import (
    Technician,
    TechnicianBankAccount,
    TechnicianDocument,
    TechnicianDocumentType,
    TechnicianVerificationStatus,
    User,
    UserRole,
)


admin_bp = Blueprint(
    "admin",
    __name__,
    url_prefix="/api/admin",
)


def _require_admin():
    """
    Verify that the authenticated JWT belongs to an ADMIN.
    """

    claims = get_jwt()

    if claims.get("role") != UserRole.ADMIN.value:
        return False

    return True


def _get_document(document):
    return {
        "id": document.id,
        "document_type": document.document_type.value,
        "document_url": document.document_url,
        "created_at": document.created_at.isoformat(),
    }


def _get_bank_account(account):
    return {
        "id": account.id,
        "account_number": account.account_number,
        "account_holder_name": account.account_holder_name,
        "ifsc_code": account.ifsc_code,
        "verification_status": (
            account.verification_status.value
            if hasattr(account.verification_status, "value")
            else account.verification_status
        ),
        "created_at": account.created_at.isoformat(),
        "updated_at": account.updated_at.isoformat(),
    }


# ============================================================
# LIST TECHNICIANS WAITING FOR VERIFICATION
# ============================================================

@admin_bp.get("/technicians/pending")
@jwt_required()
def pending_technicians():

    if not _require_admin():
        return jsonify({
            "error": "Forbidden",
            "message": "Admin access required.",
        }), 403

    technicians = Technician.query.filter_by(
        verification_status=TechnicianVerificationStatus.PENDING
    ).order_by(
        Technician.created_at.asc()
    ).all()

    return jsonify({
        "technicians": [
            technician.to_dict()
            for technician in technicians
        ]
    }), 200


# ============================================================
# GET TECHNICIAN VERIFICATION DETAILS
# ============================================================

@admin_bp.get("/technicians/<technician_id>")
@jwt_required()
def technician_details(technician_id):

    if not _require_admin():
        return jsonify({
            "error": "Forbidden",
            "message": "Admin access required.",
        }), 403

    technician = Technician.query.get(technician_id)

    if technician is None:
        return jsonify({
            "error": "NotFound",
            "message": "Technician not found.",
        }), 404

    documents = TechnicianDocument.query.filter_by(
        technician_id=technician.id
    ).all()

    bank_account = TechnicianBankAccount.query.filter_by(
        technician_id=technician.id
    ).first()

    return jsonify({
        "technician": technician.to_dict(),
        "documents": [
            _get_document(document)
            for document in documents
        ],
        "bank_account": (
            _get_bank_account(bank_account)
            if bank_account
            else None
        ),
    }), 200


# ============================================================
# VERIFY / REJECT TECHNICIAN
# ============================================================

@admin_bp.patch("/technicians/<technician_id>/verification")
@jwt_required()
def update_technician_verification(technician_id):

    if not _require_admin():
        return jsonify({
            "error": "Forbidden",
            "message": "Admin access required.",
        }), 403

    technician = Technician.query.get(technician_id)

    if technician is None:
        return jsonify({
            "error": "NotFound",
            "message": "Technician not found.",
        }), 404

    payload = request.get_json(silent=True) or {}

    status = str(
        payload.get("status", "")
    ).strip().upper()

    remarks = payload.get("remarks")

    allowed_statuses = {
        "VERIFIED",
        "REJECTED",
    }

    if status not in allowed_statuses:
        return jsonify({
            "error": "ValidationError",
            "message": "Status must be VERIFIED or REJECTED.",
        }), 400

    if status == "REJECTED" and not remarks:
        return jsonify({
            "error": "ValidationError",
            "message": "Remarks are required when rejecting a technician.",
        }), 400

    if status == "VERIFIED":

        # ----------------------------------------------------
        # Make sure all required documents exist
        # ----------------------------------------------------

        documents = TechnicianDocument.query.filter_by(
            technician_id=technician.id
        ).all()

        document_types = {
            document.document_type
            for document in documents
        }

        required_documents = {
            TechnicianDocumentType.SELFIE,
            TechnicianDocumentType.AADHAAR,
            TechnicianDocumentType.PAN,
        }

        missing_documents = required_documents - document_types

        if missing_documents:
            return jsonify({
                "error": "ValidationError",
                "message": "All required technician documents must be uploaded before verification.",
                "missing_documents": [
                    document_type.value
                    for document_type in missing_documents
                ],
            }), 400

        # ----------------------------------------------------
        # Bank account must exist
        # ----------------------------------------------------

        bank_account = TechnicianBankAccount.query.filter_by(
            technician_id=technician.id
        ).first()

        if bank_account is None:
            return jsonify({
                "error": "ValidationError",
                "message": "Technician bank account must be added before verification.",
            }), 400

        bank_account.verification_status = (
            TechnicianVerificationStatus.VERIFIED
        )

        technician.verification_status = (
            TechnicianVerificationStatus.VERIFIED
        )

        technician.verification_remarks = remarks
        technician.verified_at = db.func.now()

    else:

        technician.verification_status = (
            TechnicianVerificationStatus.REJECTED
        )

        technician.verification_remarks = remarks
        technician.verified_at = None

    db.session.commit()

    return jsonify({
        "message": "Technician verification updated successfully.",
        "technician": technician.to_dict(),
    }), 200