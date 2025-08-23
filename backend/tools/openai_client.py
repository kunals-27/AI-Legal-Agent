import os
from typing import List
from openai import OpenAI

_client = None


def get_openai() -> OpenAI:
    global _client
    if _client is None:
        base = os.getenv("OPENAI_BASE_URL")
        _client = OpenAI(base_url=base) if base else OpenAI()
    return _client


def embed_texts(texts: List[str], model: str = "text-embedding-3-small") -> List[List[float]]:
    client = get_openai()
    resp = client.embeddings.create(model=model, input=texts)
    return [item.embedding for item in resp.data]
