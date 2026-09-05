import os
from uuid import uuid4

from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required
from werkzeug.utils import secure_filename

from extensions import db
from models import Technician, TechnicianDocument, TechnicianDocumentType


technician_document_bp = Blueprint(
    "technician_documents",
    __name__,
    url_prefix="/api/technician"
)


# ============================================================
# CONFIGURATION
# ============================================================

ALLOWED_EXTENSIONS = {
    "jpg",
    "jpeg",
    "png",
    "webp",
    "pdf",
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def _allowed_file(filename: str) -> bool:
    if not filename or "." not in filename:
        return False

    extension = filename.rsplit(".", 1)[1].lower()

    return extension in ALLOWED_EXTENSIONS


def _get_technician_from_token():
    """
    JWT identity contains the User ID.

    We never trust a technician_id sent by the frontend.
    The backend finds the technician using the authenticated user.
    """

    user_id = get_jwt_identity()

    technician = Technician.query.filter_by(
        user_id=user_id
    ).first()

    return technician


def _save_document(file, technician_id, document_type):
    """
    Save uploaded document locally for development.

    Production should use private object storage
    such as S3/Supabase Storage/etc.
    """

    if not file or not file.filename:
        return None, "File is missing."

    if not _allowed_file(file.filename):
        return None, (
            "Invalid file type. Allowed types: "
            "JPG, JPEG, PNG, WEBP, PDF."
        )

    # Check file size
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)

    if file_size > MAX_FILE_SIZE:
        return None, "File size must be 10 MB or less."

    original_name = secure_filename(file.filename)

    extension = original_name.rsplit(".", 1)[1].lower()

    unique_name = (
        f"{document_type.value.lower()}_"
        f"{uuid4().hex}.{extension}"
    )

    upload_root = current_app.config.get(
        "UPLOAD_FOLDER",
        os.path.join(current_app.root_path, "uploads")
    )

    technician_folder = os.path.join(
        upload_root,
        "technicians",
        technician_id
    )

    os.makedirs(
        technician_folder,
        exist_ok=True
    )

    file_path = os.path.join(
        technician_folder,
        unique_name
    )

    file.save(file_path)

    # Store relative path in database.
    # We don't expose the actual file publicly.
    relative_path = os.path.relpath(
        file_path,
        upload_root
    ).replace("\\", "/")

    return relative_path, None


# ============================================================
# UPLOAD TECHNICIAN DOCUMENTS
# ============================================================

@technician_document_bp.post("/documents")
@jwt_required()
def upload_documents():

    technician = _get_technician_from_token()

    if technician is None:
        return jsonify({
            "error": "NotFound",
            "message": "Technician account not found."
        }), 404

    # --------------------------------------------------------
    # Only active technicians can upload
    # --------------------------------------------------------

    if not technician.is_active:
        return jsonify({
            "error": "Forbidden",
            "message": "Technician account is inactive."
        }), 403

    # --------------------------------------------------------
    # Check whether at least one document was uploaded
    # --------------------------------------------------------

    uploaded_files = {
        "selfie": request.files.get("selfie"),
        "aadhaar": request.files.get("aadhaar"),
        "pan": request.files.get("pan"),
    }

    if not any(uploaded_files.values()):
        return jsonify({
            "error": "ValidationError",
            "message": "At least one document is required."
        }), 400

    document_mapping = {
        "selfie": TechnicianDocumentType.SELFIE,
        "aadhaar": TechnicianDocumentType.AADHAAR,
        "pan": TechnicianDocumentType.PAN,
    }

    uploaded_documents = []
    errors = []

    # --------------------------------------------------------
    # Process each uploaded document
    # --------------------------------------------------------

    for field_name, document_type in document_mapping.items():

        uploaded_file = uploaded_files[field_name]

        if uploaded_file is None:
            continue

        # Save file
        document_path, error = _save_document(
            uploaded_file,
            technician.id,
            document_type
        )

        if error:
            errors.append({
                "field": field_name,
                "message": error
            })
            continue

        # ----------------------------------------------------
        # Check whether document already exists
        # ----------------------------------------------------

        existing_document = TechnicianDocument.query.filter_by(
            technician_id=technician.id,
            document_type=document_type
        ).first()

        if existing_document:

            # Delete the old database reference.
            # The old physical file can be cleaned separately.
            existing_document.document_url = document_path

            document = existing_document

        else:

            document = TechnicianDocument(
                technician_id=technician.id,
                document_type=document_type,
                document_url=document_path,
            )

            db.session.add(document)

        uploaded_documents.append(document)

    # --------------------------------------------------------
    # Stop if validation errors occurred
    # --------------------------------------------------------

    if errors:
        db.session.rollback()

        return jsonify({
            "error": "ValidationError",
            "message": "One or more documents could not be uploaded.",
            "fields": errors
        }), 400

    # --------------------------------------------------------
    # Keep technician pending until admin verification
    # --------------------------------------------------------

    # Do NOT automatically verify the technician.
    # Uploading documents does not mean the documents are valid.

    db.session.commit()

    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    documents_response = []

    for document in uploaded_documents:
        documents_response.append({
            "id": document.id,
            "document_type": document.document_type.value,
            "document_url": document.document_url,
            "created_at": document.created_at.isoformat(),
        })

    return jsonify({
        "message": "Technician documents uploaded successfully.",
        "verification_status": technician.verification_status.value,
        "documents": documents_response,
    }), 201