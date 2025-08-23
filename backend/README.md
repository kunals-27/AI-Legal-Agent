# Multi-Agent Legal Assistant (Backend)

Flask backend that orchestrates RAG with Milvus, Ollama, and Firecrawl.

## Quick start

1. Create `.env` from `.env.example` and set keys.
2. (Optional) Pull Ollama models:
   ```bash
   ollama pull mistral
   ollama pull mistral:7b
   ```
3. Install deps:
   ```bash
   pip install -r requirements.txt
   ```
4. Run:
   ```bash
   python main.py
   ```
5. Test health:
   ```bash
   curl http://localhost:8000/healthz
   ```

## Endpoints
- POST /ask
- POST /ingest
- GET /healthz, /readyz

## Notes
- Retrieval and agents are stubbed; wire real Milvus, OpenAI embeddings, and Ollama prompts next.
