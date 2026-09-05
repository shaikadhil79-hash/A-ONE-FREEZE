from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from datetime import datetime, timezone
from sqlalchemy import or_

from extensions import db
from models import CustomerProfile, Technician, User, UserRole
from utils.validators import (
    normalize_email,
    normalize_phone,
    require_fields,
    validate_email,
    validate_password,
)


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# ============================================================
# JWT TOKEN
# ============================================================

def _create_token(user: User) -> str:
    return create_access_token(
        identity=user.id,
        additional_claims={
            "role": user.role.value
        },
    )


# ============================================================
# CUSTOMER REGISTRATION
# ============================================================

def _register_customer(payload: dict):

    # Required only during account registration
    required = [
        "username",
        "password",
        "full_name",
    ]

    missing = require_fields(payload, required)

    if missing:
        return jsonify({
            "error": "ValidationError",
            "message": "Missing required fields.",
            "fields": missing,
        }), 400

    # --------------------------------------------------------
    # Get values
    # --------------------------------------------------------

    username = payload["username"].strip()

    email = (
        normalize_email(payload["email"])
        if payload.get("email")
        else None
    )

    phone = (
        normalize_phone(payload["phone"])
        if payload.get("phone")
        else None
    )

    password = payload["password"]

    # --------------------------------------------------------
    # Email OR phone is required
    # --------------------------------------------------------

    if not email and not phone:
        return jsonify({
            "error": "ValidationError",
            "message": "Email or phone number is required.",
        }), 400

    # --------------------------------------------------------
    # Username validation
    # --------------------------------------------------------

    if not username:
        return jsonify({
            "error": "ValidationError",
            "message": "Username is required.",
        }), 400

    # --------------------------------------------------------
    # Email validation
    # --------------------------------------------------------

    if email and not validate_email(email):
        return jsonify({
            "error": "ValidationError",
            "message": "Invalid email address.",
        }), 400

    # --------------------------------------------------------
    # Password validation
    # --------------------------------------------------------

    if not validate_password(password):
        return jsonify({
            "error": "ValidationError",
            "message": "Password must contain at least 8 characters.",
        }), 400

    # --------------------------------------------------------
    # Duplicate username
    # --------------------------------------------------------

    if User.query.filter_by(username=username).first():
        return jsonify({
            "error": "Conflict",
            "message": "Username is already registered.",
        }), 409

    # --------------------------------------------------------
    # Duplicate email
    # --------------------------------------------------------

    if email and User.query.filter_by(email=email).first():
        return jsonify({
            "error": "Conflict",
            "message": "Email is already registered.",
        }), 409

    # --------------------------------------------------------
    # Duplicate phone
    # --------------------------------------------------------

    if phone and User.query.filter_by(phone=phone).first():
        return jsonify({
            "error": "Conflict",
            "message": "Phone number is already registered.",
        }), 409

    if phone and CustomerProfile.query.filter_by(phone=phone).first():
        return jsonify({
            "error": "Conflict",
            "message": "Phone number is already registered.",
        }), 409

    # ========================================================
    # CREATE USER
    # ========================================================

    user = User(
        username=username,
        email=email,
        phone=phone,
        role=UserRole.CUSTOMER,
    )

    # Never store the plain-text password
    user.set_password(password)

    # ========================================================
    # CREATE CUSTOMER PROFILE
    # ========================================================

    profile = CustomerProfile(
        full_name=payload["full_name"].strip(),

        phone=phone,

        # Address information is OPTIONAL during registration
        address=payload.get("address"),
        landmark=payload.get("landmark"),
        city=payload.get("city"),
        pincode=payload.get("pincode"),

        latitude=payload.get("latitude"),
        longitude=payload.get("longitude"),
    )

    user.customer_profile = profile

    # ========================================================
    # SAVE
    # ========================================================

    db.session.add(user)
    db.session.commit()

    # ========================================================
    # RESPONSE
    # ========================================================

    return jsonify({
        "message": "Customer registered successfully.",
        "user": user.to_dict(),
        "profile": profile.to_dict(),
        "access_token": _create_token(user),
    }), 201


# ============================================================
# TECHNICIAN REGISTRATION
# ============================================================

def _register_technician(payload: dict):

    # Allow both "mobile_number" and "phone"
    payload = {
        **payload,
        "mobile_number": (
            payload.get("mobile_number")
            or payload.get("phone")
        ),
    }

    required = [
        "username",
        "password",
        "full_name",
        "mobile_number",
        "date_of_birth",
    ]

    missing = require_fields(payload, required)

    if missing:
        return jsonify({
            "error": "ValidationError",
            "message": "Missing required fields.",
            "fields": missing,
        }), 400

    # --------------------------------------------------------
    # Get values
    # --------------------------------------------------------

    username = payload["username"].strip()

    email = (
        normalize_email(payload["email"])
        if payload.get("email")
        else None
    )

    mobile_number = normalize_phone(
        payload["mobile_number"]
    )

    password = payload["password"]

    # --------------------------------------------------------
    # DATE OF BIRTH / 18+ VALIDATION
    # --------------------------------------------------------

    date_of_birth_raw = str(
        payload["date_of_birth"]
    ).strip()

    try:
        date_of_birth = datetime.strptime(
            date_of_birth_raw,
            "%Y-%m-%d"
        ).date()
    except ValueError:
        return jsonify({
            "error": "ValidationError",
            "message": "Date of birth must use YYYY-MM-DD format.",
        }), 400

    today = datetime.now(timezone.utc).date()

    if date_of_birth > today:
        return jsonify({
            "error": "ValidationError",
            "message": "Date of birth cannot be in the future.",
        }), 400

    age = (
        today.year
        - date_of_birth.year
        - (
            (today.month, today.day)
            < (date_of_birth.month, date_of_birth.day)
        )
    )

    if age < 18:
        return jsonify({
            "error": "AgeRequirement",
            "message": "Technicians must be at least 18 years old.",
            "minimum_age": 18,
        }), 403

    # --------------------------------------------------------
    # Username validation
    # --------------------------------------------------------

    if not username:
        return jsonify({
            "error": "ValidationError",
            "message": "Username is required.",
        }), 400

    # --------------------------------------------------------
    # Email validation
    # --------------------------------------------------------

    if email and not validate_email(email):
        return jsonify({
            "error": "ValidationError",
            "message": "Invalid email address.",
        }), 400

    # --------------------------------------------------------
    # Password validation
    # --------------------------------------------------------

    if not validate_password(password):
        return jsonify({
            "error": "ValidationError",
            "message": "Password must contain at least 8 characters.",
        }), 400

    # --------------------------------------------------------
    # Duplicate username
    # --------------------------------------------------------

    if User.query.filter_by(username=username).first():
        return jsonify({
            "error": "Conflict",
            "message": "Username is already registered.",
        }), 409

    # --------------------------------------------------------
    # Duplicate email
    # --------------------------------------------------------

    if email and User.query.filter_by(email=email).first():
        return jsonify({
            "error": "Conflict",
            "message": "Email is already registered.",
        }), 409

    # --------------------------------------------------------
    # Duplicate mobile number
    # --------------------------------------------------------

    if User.query.filter_by(phone=mobile_number).first():
        return jsonify({
            "error": "Conflict",
            "message": "Mobile number is already registered.",
        }), 409

    if Technician.query.filter_by(
        mobile_number=mobile_number
    ).first():
        return jsonify({
            "error": "Conflict",
            "message": "Phone number is already registered.",
        }), 409

    # ========================================================
    # CREATE USER
    # ========================================================

    user = User(
        username=username,
        email=email,
        phone=mobile_number,
        role=UserRole.TECHNICIAN,
    )

    user.set_password(password)

    # ========================================================
    # CREATE TECHNICIAN
    # ========================================================

    technician = Technician(
        full_name=payload["full_name"].strip(),
        mobile_number=mobile_number,
        date_of_birth=date_of_birth,
    )

    user.technician = technician

    # ========================================================
    # SAVE
    # ========================================================

    db.session.add(user)
    db.session.commit()

    # ========================================================
    # RESPONSE
    # ========================================================

    return jsonify({
        "message": "Technician registered successfully.",
        "user": user.to_dict(),
        "technician": technician.to_dict(),
        "access_token": _create_token(user),
    }), 201


# ============================================================
# LOGIN
# ============================================================

def _login(payload: dict, role: UserRole):

    # Password is always required
    missing = require_fields(
        payload,
        ["password"]
    )

    if missing:
        return jsonify({
            "error": "ValidationError",
            "message": "Password is required.",
        }), 400

    # --------------------------------------------------------
    # Login identifier
    #
    # Can be:
    # username
    # email
    # phone
    # --------------------------------------------------------

    identifier = (
        payload.get("username")
        or payload.get("email")
        or payload.get("phone")
    )

    if not identifier:
        return jsonify({
            "error": "ValidationError",
            "message": "Username, email, or phone is required.",
        }), 400

    identifier = identifier.strip()

    normalized_email = normalize_email(identifier)
    normalized_phone = normalize_phone(identifier)

    # --------------------------------------------------------
    # Find user
    # --------------------------------------------------------

    user = User.query.filter(
        User.role == role,
        or_(
            User.username == identifier,
            User.email == normalized_email,
            User.phone == normalized_phone,
        ),
    ).first()

    # --------------------------------------------------------
    # Password check
    # --------------------------------------------------------

    if user is None or not user.check_password(
        payload["password"]
    ):
        return jsonify({
            "error": "Unauthorized",
            "message": "Invalid email or password.",
        }), 401

    # --------------------------------------------------------
    # Account status
    # --------------------------------------------------------

    if not user.is_active:
        return jsonify({
            "error": "Forbidden",
            "message": "This account is inactive.",
        }), 403

    # ========================================================
    # RESPONSE
    # ========================================================

    response = {
        "message": "Login successful.",
        "user": user.to_dict(),
        "access_token": _create_token(user),
    }

    # Customer profile
    if (
        role == UserRole.CUSTOMER
        and user.customer_profile
    ):
        response["profile"] = (
            user.customer_profile.to_dict()
        )

    # Technician profile
    if (
        role == UserRole.TECHNICIAN
        and user.technician
    ):
        response["technician"] = (
            user.technician.to_dict()
        )

    return jsonify(response), 200


# ============================================================
# CUSTOMER REGISTER API
# ============================================================

@auth_bp.post("/customer/register")
def customer_register():
    payload = request.get_json(silent=True) or {}

    try:
        return _register_customer(payload)

    except Exception as e:
        db.session.rollback()

        print("\n" + "=" * 70)
        print("CUSTOMER REGISTRATION DATABASE ERROR")
        print("=" * 70)
        print("ERROR TYPE:", type(e).__name__)
        print("ERROR:", str(e))
        print("=" * 70 + "\n")

        raise


# ============================================================
# CUSTOMER LOGIN API
# ============================================================

@auth_bp.post("/customer/login")
def customer_login():

    return _login(
        request.get_json(silent=True) or {},
        UserRole.CUSTOMER,
    )


# ============================================================
# TECHNICIAN REGISTER API
# ============================================================

@auth_bp.post("/technician/register")
def technician_register():

    payload = request.get_json(
        silent=True
    ) or {}

    try:
        return _register_technician(payload)

    except Exception:
        db.session.rollback()
        raise


# ============================================================
# TECHNICIAN LOGIN API
# ============================================================

@auth_bp.post("/technician/login")
def technician_login():

    return _login(
        request.get_json(silent=True) or {},
        UserRole.TECHNICIAN,
    )

@auth_bp.post("/admin/login")
def admin_login():
    return _login(
        request.get_json(silent=True) or {},
        UserRole.ADMIN
    )    