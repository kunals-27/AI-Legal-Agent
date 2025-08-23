import os
from typing import List, Dict, Any
import json
import yaml
import logging

from tools.embeddings import embed_texts

try:
    from pymilvus import connections, Collection
except Exception:  # pragma: no cover
    connections = None  # type: ignore
    Collection = None  # type: ignore


class MilvusRetriever:
    def __init__(self, host: str, port: str, collection: str):
        self.host = host
        self.port = port
        self.collection_name = collection
        self._connected = False
        # Load retrieval settings
        cfg_path = os.path.join(os.path.dirname(__file__), "..", "configs", "retrieval.yaml")
        with open(os.path.normpath(cfg_path), "r", encoding="utf-8") as f:
            cfg = yaml.safe_load(f) or {}
        self.k_default = int(cfg.get("k", 20))
        self._log = logging.getLogger(__name__)
        self._log.info("MilvusRetriever initialized host=%s port=%s collection=%s k_default=%s", self.host, self.port, self.collection_name, self.k_default)

    def _connect(self):
        if self._connected or connections is None:
            return
        connections.connect(alias="default", host=self.host, port=self.port)
        self._connected = True

    def retrieve(self, query: str, k: int = None) -> List[Dict[str, Any]]:
        k = k or self.k_default
        # 1) embed the query
        self._log.info("Embedding query for retrieval; len(query)=%d", len(query))
        try:
            vec = embed_texts([query])[0]
        except Exception as e:
            self._log.exception("Embedding failed: %s", e)
            raise

        # 2) search in Milvus
        try:
            self._connect()
            if Collection is None:
                raise RuntimeError("pymilvus not available")
            col = Collection(self.collection_name)
            # use default field names: "vector" as embedding field; adjust if different
            res = col.search(
                data=[vec],
                anns_field="vector",
                param={"metric_type": "COSINE", "params": {"ef": 128}},
                limit=k,
                output_fields=["text", "source", "section", "meta"],
            )
            hits = res[0]
            out: List[Dict[str, Any]] = []
            for h in hits:
                fields = h.entity.get("" ) if hasattr(h, "entity") else {}
                # When output_fields provided, use .entity.fields
                try:
                    text = h.entity.get("text")
                except Exception:
                    text = None
                try:
                    source = h.entity.get("source")
                except Exception:
                    source = None
                try:
                    section = h.entity.get("section")
                except Exception:
                    section = None
                try:
                    meta = h.entity.get("meta")
                except Exception:
                    meta = None
                if isinstance(meta, str):
                    try:
                        meta = json.loads(meta)
                    except Exception:
                        pass
                out.append({
                    "text": text or "",
                    "source": source or "",
                    "section": section or "",
                    "meta": meta or {},
                    "score": float(h.distance),
                })
            self._log.info("Milvus search completed: %d hits returned (limit=%d)", len(out), k)
            return out
        except Exception as e:
            self._log.exception("Milvus search failed: %s", e)
            raise
