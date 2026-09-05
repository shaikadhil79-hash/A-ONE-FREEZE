from flask import Blueprint, jsonify
from sqlalchemy import text

from extensions import db

health_bp = Blueprint("health", __name__)


@health_bp.get("/api/health")
def health_check():
    try:
        db.session.execute(text("SELECT 1"))
        return jsonify({
            "status": "ok",
            "service": "aone-freeze-backend",
            "database": "connected",
        }), 200
    except Exception:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "service": "aone-freeze-backend",
            "database": "unavailable",
        }), 503
