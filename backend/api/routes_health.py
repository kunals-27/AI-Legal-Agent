from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)


@health_bp.get("/healthz")
def healthz():
    return jsonify({"status": "ok"})


@health_bp.get("/readyz")
def readyz():
    # In a fuller impl, check Milvus and Ollama readiness.
    return jsonify({"ready": True})
