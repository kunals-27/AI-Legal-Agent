import os
from typing import List, Dict, Any
import logging
import requests

_log = logging.getLogger(__name__)


class FirecrawlClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.firecrawl.dev"
        self.timeout = 25
        self._session = requests.Session()

    def _headers(self) -> Dict[str, str]:
        return {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}

    def _normalize(self, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        out: List[Dict[str, Any]] = []
        for it in items or []:
            out.append({
                "url": it.get("url") or it.get("link") or "",
                "title": it.get("title") or it.get("name") or "",
                "snippet": it.get("snippet") or it.get("description") or it.get("content") or "",
            })
        return out

    def search_and_extract(self, query: str, limit: int = 3) -> List[Dict[str, Any]]:
        if not self.api_key:
            _log.warning("Firecrawl API key missing; skipping web search")
            return []
        payload = {"query": query, "limit": limit}
        try:
            # Prefer POST /v1/search with JSON body
            url = f"{self.base_url}/v1/search"
            r = self._session.post(url, json=payload, headers=self._headers(), timeout=self.timeout)
            if r.status_code == 200:
                data = r.json()
                items = data.get("results") or data.get("data") or []
                out = self._normalize(items)
                _log.info("Firecrawl returned %d results", len(out))
                return out
            else:
                _log.warning("Firecrawl POST /v1/search non-200: %s %s", r.status_code, r.text[:300])
        except requests.RequestException as e:
            _log.exception("Firecrawl POST /v1/search failed: %s", e)

        # Fallback: GET with query params if POST path not available
        try:
            url = f"{self.base_url}/v1/search"
            r = self._session.get(url, params={"q": query, "limit": limit}, headers=self._headers(), timeout=self.timeout)
            if r.status_code == 200:
                data = r.json()
                items = data.get("results") or data.get("data") or []
                out = self._normalize(items)
                _log.info("Firecrawl (GET fallback) returned %d results", len(out))
                return out
            else:
                _log.warning("Firecrawl GET /v1/search non-200: %s %s", r.status_code, r.text[:300])
        except requests.RequestException as e:
            _log.exception("Firecrawl GET /v1/search failed: %s", e)

        return []
