import os
import json
import glob
from typing import Dict, Any, List, Iterable

from pymilvus import connections, Collection
from tools.embeddings import embed_texts


def _yield_texts_from_dir(path: str) -> Iterable[Dict[str, str]]:
    # Read only .txt for simplicity
    for p in glob.glob(os.path.join(path, "**", "*.txt"), recursive=True):
        try:
            with open(p, "r", encoding="utf-8", errors="ignore") as f:
                yield {"text": f.read(), "source": os.path.relpath(p, path), "section": ""}
        except Exception:
            continue


def _chunk(text: str, size: int = 800, overlap: int = 100) -> List[str]:
    if size <= 0:
        return [text]
    chunks: List[str] = []
    start = 0
    n = len(text)
    while start < n:
        end = min(n, start + size)
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start = end - overlap if end - overlap > start else end
    return chunks


class Ingestor:
    def __init__(self, host: str, port: str, collection: str):
        self.host = host
        self.port = port
        self.collection = collection

    def ingest(self, source_uri: str, options: Dict[str, Any]) -> Dict[str, Any]:
        # Collect texts
        items: List[Dict[str, str]] = []
        texts_opt = options.get("texts") or []
        if isinstance(texts_opt, list) and texts_opt:
            for i, t in enumerate(texts_opt):
                items.append({"text": str(t), "source": options.get("source", "inline"), "section": f"item-{i}"})
        elif os.path.isdir(source_uri):
            items.extend(list(_yield_texts_from_dir(source_uri)))
        else:
            raise ValueError("ingest: either provide options.texts or a directory path with .txt files")

        # Chunk
        max_chars = int(options.get("chunk_size", 800))
        overlap = int(options.get("chunk_overlap", 100))
        rows: List[Dict[str, Any]] = []
        for it in items:
            chs = _chunk(it["text"], size=max_chars, overlap=overlap)
            for idx, ch in enumerate(chs):
                rows.append({
                    "text": ch,
                    "source": it.get("source", ""),
                    "section": it.get("section", ""),
                    "meta": {},
                })

        if not rows:
            return {"id": "noop", "inserted": 0}

        # Embed
        vecs = embed_texts([r["text"] for r in rows])

        # Upsert (insert)
        connections.connect(host=self.host, port=self.port)
        col = Collection(self.collection)
        col.load()

        entities = [
            [r["text"] for r in rows],
            [r["source"] for r in rows],
            [r["section"] for r in rows],
            [json.dumps(r.get("meta", {})) for r in rows],
            vecs,
        ]
        mr = col.insert(entities)
        col.flush()

        return {"id": "job-ok", "inserted": len(rows), "ids": getattr(mr, "primary_keys", [])}
