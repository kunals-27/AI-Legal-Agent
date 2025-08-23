import os
from typing import Dict, Any
import requests
import logging
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_TIMEOUT = int(os.getenv("OLLAMA_TIMEOUT", "300"))  # seconds
_log = logging.getLogger(__name__)


def generate(model: str, prompt: str, temperature: float = 0.2, max_tokens: int = 1024) -> str:
    """Calls Ollama non-streaming for a full response."""
    url = f"{OLLAMA_HOST}/api/generate"
    payload: Dict[str, Any] = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
        },
    }
    try:
        _log.info(
            "Ollama request: model=%s host=%s len(prompt)=%d num_predict=%d temp=%.2f timeout=%ds",
            model,
            OLLAMA_HOST,
            len(prompt),
            max_tokens,
            temperature,
            OLLAMA_TIMEOUT,
        )

        # Session with retries on transient failures, including read timeouts
        session = requests.Session()
        retry = Retry(
            total=2,
            read=2,
            connect=2,
            backoff_factor=1.5,
            status_forcelist=(502, 503, 504),
            allowed_methods=("POST",),
            raise_on_status=False,
        )
        adapter = HTTPAdapter(max_retries=retry)
        session.mount("http://", adapter)
        session.mount("https://", adapter)

        # Use (connect, read) tuple for timeout
        r = session.post(url, json=payload, timeout=(15, OLLAMA_TIMEOUT))
        r.raise_for_status()
        data = r.json()
        _log.info("Ollama response received: tokens=%s", data.get("eval_count"))
        return data.get("response", "")
    except requests.RequestException as e:
        _log.exception("Ollama request failed: %s", e)
        raise

