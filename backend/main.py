import os
import logging
from flask import Flask
from flask_cors import CORS
from api.routes_health import health_bp
from api.routes_ask import ask_bp
from api.routes_ingest import ingest_bp
from dotenv import load_dotenv


def create_app() -> Flask:
    # Load env from backend/.env
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        load_dotenv(env_path)

    # Basic logging config (INFO level)
    logging.basicConfig(
        level=os.getenv("LOG_LEVEL", "INFO"),
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )

    app = Flask(__name__)

    # CORS for React dev server
    origins = os.getenv("ALLOWED_ORIGINS", "*")
    # Explicitly allow common methods and headers so preflight passes
    CORS(
        app,
        resources={r"/*": {
            "origins": [o.strip() for o in origins.split(",") if o.strip()] if origins != "*" else "*",
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": False,
        }}
    )

    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(ask_bp)
    app.register_blueprint(ingest_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv("APP_PORT", 8000))
    app.run(host="0.0.0.0", port=port)
