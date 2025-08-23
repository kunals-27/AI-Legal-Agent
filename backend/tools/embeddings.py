import os
import logging
from typing import List

from .openai_client import get_openai
from .ollama_client import OLLAMA_HOST
import requests

_log = logging.getLogger(__name__)

# Env configuration
BACKEND = os.getenv("EMBEDDINGS_BACKEND", "openai").lower()  # openai | ollama
OPENAI_MODEL = os.getenv("OPENAI_EMBED_MODEL", "text-embedding-3-small")
OLLAMA_MODEL = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")


def _embed_openai(texts: List[str], model: str = OPENAI_MODEL) -> List[List[float]]:
    client = get_openai()
    _log.info("Embeddings (openai): model=%s, batch=%d", model, len(texts))
    resp = client.embeddings.create(model=model, input=texts)
    return [item.embedding for item in resp.data]


def _embed_ollama(texts: List[str], model: str = OLLAMA_MODEL) -> List[List[float]]:
    url = f"{OLLAMA_HOST}/api/embeddings"
    vecs: List[List[float]] = []
    _log.info("Embeddings (ollama): host=%s model=%s batch=%d", OLLAMA_HOST, model, len(texts))
    for t in texts:
        payload = {"model": model, "prompt": t}
        r = requests.post(url, json=payload, timeout=120)
        r.raise_for_status()
        data = r.json()
        v = data.get("embedding") or data.get("data", [{}])[0].get("embedding")
        if not v:
            raise RuntimeError("Ollama embeddings: missing 'embedding' in response")
        vecs.append(v)
    return vecs


def embed_texts(texts: List[str]) -> List[List[float]]:
    """Return embeddings. Honors EMBEDDINGS_BACKEND and falls back if configured.
    Set EMBEDDINGS_BACKEND=openai|ollama.
    Optionally set EMBEDDINGS_FALLBACK=ollama to try Ollama if OpenAI fails.
    """
    backend = BACKEND
    fallback = os.getenv("EMBEDDINGS_FALLBACK", "").lower()

    if backend == "openai":
        try:
            return _embed_openai(texts)
        except Exception as e:
            _log.exception("OpenAI embeddings failed: %s", e)
            if fallback == "ollama":
                _log.info("Falling back to Ollama embeddings...")
                return _embed_ollama(texts)
            raise
    elif backend == "ollama":
        return _embed_ollama(texts)
    else:
        raise ValueError(f"Unsupported EMBEDDINGS_BACKEND={backend}")
