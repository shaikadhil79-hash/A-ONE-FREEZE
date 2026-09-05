from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from extensions import db
from models import User, UserRole


def current_user() -> User | None:
    user_id = get_jwt_identity()
    if not user_id:
        return None
    return db.session.get(User, str(user_id))


def role_required(*allowed_roles: UserRole):
    allowed = {role.value for role in allowed_roles}

    def decorator(view):
        @wraps(view)
        @jwt_required()
        def wrapped(*args, **kwargs):
            claims = get_jwt()
            role = claims.get("role")
            if role not in allowed:
                return jsonify({"error": "Forbidden", "message": "You do not have permission for this resource."}), 403
            user = current_user()
            if user is None or not user.is_active:
                return jsonify({"error": "Unauthorized", "message": "User account is inactive or missing."}), 401
            return view(*args, **kwargs)

        return wrapped

    return decorator
