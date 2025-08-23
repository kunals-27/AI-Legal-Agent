import os
from typing import Any, Dict, List

# Lazy, minimal stubs; replace with real implementations
from retriever.milvus_client import MilvusRetriever
from agents.paralegal import ParalegalAgent
from agents.router import RouterAgent
from agents.synthesizer import SynthesizerAgent
from tools.firecrawl_client import FirecrawlClient
from retriever.ingest import Ingestor as RealIngestor


_retriever = None
_paralegal = None
_router = None
_synth = None
_firecrawl = None
_ingestor = None


class Ingestor:
    def __init__(self) -> None:
        host = os.getenv("MILVUS_HOST", "localhost")
        port = os.getenv("MILVUS_PORT", "19530")
        collection = os.getenv("MILVUS_COLLECTION", "legal_chunks")
        self.impl = RealIngestor(host, port, collection)

    def ingest(self, source_uri: str, options: Dict[str, Any]) -> Dict[str, Any]:
        return self.impl.ingest(source_uri, options)


def get_retriever() -> MilvusRetriever:
    global _retriever
    if _retriever is None:
        host = os.getenv("MILVUS_HOST", "localhost")
        port = os.getenv("MILVUS_PORT", "19530")
        collection = os.getenv("MILVUS_COLLECTION", "legal_chunks")
        _retriever = MilvusRetriever(host, port, collection)
    return _retriever


def get_paralegal_agent() -> ParalegalAgent:
    global _paralegal
    if _paralegal is None:
        _paralegal = ParalegalAgent()
    return _paralegal


def get_router_agent() -> RouterAgent:
    global _router
    if _router is None:
        _router = RouterAgent()
    return _router


def get_synthesizer_agent() -> SynthesizerAgent:
    global _synth
    if _synth is None:
        _synth = SynthesizerAgent()
    return _synth


def get_firecrawl() -> FirecrawlClient:
    global _firecrawl
    if _firecrawl is None:
        api_key = os.getenv("FIRECRAWL_API_KEY", "")
        _firecrawl = FirecrawlClient(api_key)
    return _firecrawl


def get_ingestor() -> Ingestor:
    global _ingestor
    if _ingestor is None:
        _ingestor = Ingestor()
    return _ingestor
