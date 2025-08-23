from flask import Blueprint, request, jsonify
from api.deps import get_retriever, get_paralegal_agent, get_router_agent, get_synthesizer_agent, get_firecrawl

ask_bp = Blueprint("ask", __name__)


@ask_bp.post("/ask")
def ask():
    data = request.get_json(force=True)
    query = data.get("query", "").strip()
    if not query:
        return jsonify({"error": "query is required"}), 400

    # 1) retrieve context
    retriever = get_retriever()
    # Use retriever default 'k' from configs/retrieval.yaml
    ctx = retriever.retrieve(query)

    # 2) draft answer
    paralegal = get_paralegal_agent()
    draft = paralegal.generate(query, ctx)

    # 3) route/judge
    router = get_router_agent()
    verdict = router.evaluate(query, draft, ctx)

    web_ctx = []
    if not verdict.get("pass", False):
        # 4) web search fallback
        firecrawl = get_firecrawl()
        web_ctx = firecrawl.search_and_extract(query)

    # 5) synthesize
    synthesizer = get_synthesizer_agent()
    final = synthesizer.synthesize(query, ctx, web_ctx, draft, verdict)

    # Prepare compact sources from retrieval context
    sources = [
        {
            "source": c.get("source", ""),
            "section": c.get("section", ""),
            "score": c.get("score", 0.0),
            "text": c.get("text", ""),
        }
        for c in ctx
    ]

    resp = {
        "answer": final.get("text", ""),
        "citations": final.get("citations", []),
        "sources": sources,
        "web_sources": web_ctx,
        "routing": verdict,
        "timings": final.get("timings", {}),
    }
    return jsonify(resp)
