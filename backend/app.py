from flask import Flask, jsonify
from sqlalchemy.exc import IntegrityError

from config import Config
from commands import create_admin
from extensions import cors, db, jwt, migrate

from routes.auth_routes import auth_bp
from routes.customer_routes import customer_bp
from routes.health_routes import health_bp
from routes.technician_status_routes import technician_status_bp
from routes.technician_bank_routes import technician_bank_bp
from routes.technician_document_routes import technician_document_bp
from routes.admin_routes import admin_bp
from routes.technician_booking_routes import technician_booking_bp


def create_app() -> Flask:

    app = Flask(__name__)

    app.config.from_object(Config)

    # CLI COMMANDS

    app.cli.add_command(create_admin)


    # ==============================
    # INITIALIZE EXTENSIONS
    # ==============================

    db.init_app(app)

    migrate.init_app(app, db)

    jwt.init_app(app)


    # ==============================
    # CORS CONFIGURATION
    # ==============================

    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "http://localhost:5175",

                    "http://127.0.0.1:5173",
                    "http://127.0.0.1:5174",
                    "http://127.0.0.1:5175",
                ]
            }
        },
        methods=[
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],
        allow_headers=[
            "Content-Type",
            "Authorization",
        ],
    )


    # ==============================
    # IMPORT MODELS
    # ==============================

    import models  # noqa: F401


    # ==============================
    # REGISTER BLUEPRINTS
    # ==============================

    app.register_blueprint(health_bp)

    app.register_blueprint(auth_bp)

    app.register_blueprint(technician_status_bp)

    app.register_blueprint(customer_bp)

    app.register_blueprint(technician_bank_bp)

    app.register_blueprint(technician_document_bp)

    app.register_blueprint(admin_bp)

    app.register_blueprint(technician_booking_bp)


    # ==============================
    # ERROR HANDLERS
    # ==============================

    @app.errorhandler(404)
    def not_found(_error):

        return jsonify({
            "error": "NotFound",
            "message": "Endpoint not found.",
        }), 404


    @app.errorhandler(405)
    def method_not_allowed(_error):

        return jsonify({
            "error": "MethodNotAllowed",
            "message": "HTTP method is not allowed.",
        }), 405


    @app.errorhandler(IntegrityError)
    def integrity_error(_error):

        db.session.rollback()

        return jsonify({
            "error": "DatabaseConflict",
            "message": "The requested operation conflicts with existing data.",
        }), 409


    @app.errorhandler(Exception)
    def unhandled_error(error):

        app.logger.exception(
            "Unhandled application error: %s",
            error,
        )

        db.session.rollback()

        return jsonify({
            "error": "InternalServerError",
            "message": "An unexpected server error occurred.",
        }), 500


    return app


# ==============================
# CREATE APPLICATION
# ==============================

app = create_app()


if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
    )