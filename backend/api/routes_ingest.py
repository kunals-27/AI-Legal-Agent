from flask import Blueprint, request, jsonify
from api.deps import get_ingestor

ingest_bp = Blueprint("ingest", __name__)


@ingest_bp.post("/ingest")
def ingest():
    data = request.get_json(force=True)
    source = data.get("source_uri")
    options = data.get("options", {})
    if not source:
        return jsonify({"error": "source_uri is required"}), 400

    ingestor = get_ingestor()
    job = ingestor.ingest(source, options)
    return jsonify({"job_id": job["id"], "status": "queued"})
