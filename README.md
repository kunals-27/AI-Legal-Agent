# AI Legal Agent


<div align="center">

<h3>⚖️ AI‑Powered Legal Research Assistant</h3>

<p>
  <em>Ingest • 🔎 Retrieve • ✍️ Analyze • ✅ Verify</em>
  <br/>
  <sub>Grounded, cited answers over your legal corpus with optional web augmentation.</sub>
  <br/>
  <a href="#installation--setup">Get Started</a>
</p>

<!-- Badges: Tech stack overview -->

<p>
  <img alt="status" src="https://img.shields.io/badge/status-in%20development-orange" />
  <img alt="frontend" src="https://img.shields.io/badge/frontend-React%20%2B%20Vite%20%2B%20TS-00ADD8?logo=react" />
  <img alt="backend" src="https://img.shields.io/badge/backend-Flask-000000?logo=flask" />
  <img alt="vector db" src="https://img.shields.io/badge/vector%20DB-Milvus-6C2EFF" />
  <img alt="llm" src="https://img.shields.io/badge/LLM-Ollama%20(Mistral)-8A2BE2" />
  <img alt="embeddings" src="https://img.shields.io/badge/embeddings-OpenAI%20|%20Ollama-6E6E6E" />
  <img alt="web search" src="https://img.shields.io/badge/web%20search-Firecrawl-FF6A00" />
  <img alt="ui" src="https://img.shields.io/badge/UI-Tailwind%20CSS-38B2AC?logo=tailwindcss" />
  
</p>

</div>

---

## Overview

AI Legal Agent orchestrates a practical legal-research workflow:

- Retrieves relevant context from a vector store (Milvus) using OpenAI or Ollama embeddings.
- Drafts a concise answer with a Paralegal agent (LLM via Ollama).
- Judges the draft with a Router agent; if coverage/grounding are weak, it optionally augments with fresh web results via Firecrawl.
- Produces a structured, final answer with inline citations using a Synthesizer agent.
- Presents results in a polished React + Tailwind UI with conversation history and source context.

This is useful when you need explainable, reference-backed legal research with the ability to control your data pipeline.

## Features

- __Multi-agent pipeline (__`backend/api/routes_ask.py`__):__ Retrieval → Drafting → Routing/Judging → Web Augmentation → Synthesis.
- __Vector retrieval with Milvus (__`backend/retriever/milvus_client.py`__):__ Top-k semantic search over ingested chunks.
- __Embeddings pluggable backend (__`backend/tools/embeddings.py`__):__ OpenAI Embeddings or Ollama (`nomic-embed-text`).
- __Content ingestion (__`backend/api/routes_ingest.py`__, `backend/retriever/ingest.py`__):__ Ingest inline texts or a directory of `.txt` files, with chunking + embedding → Milvus insert.
- __Web search fallback (__`backend/tools/firecrawl_client.py`__):__ When the judge flags issues, searches the web and normalizes results for citations.
- __Attractive chat UI (__`frontend/src/pages/ChatbotPage.tsx`__):__ Markdown answers, citations (R#/W#), source sidebar, conversation history persisted in `localStorage`.
- __Health endpoints (__`backend/api/routes_health.py`__):__ `GET /healthz`, `GET /readyz`.
- __Config-driven behavior (__`backend/configs/*.yaml`__):__ Retrieval defaults, Milvus/firecrawl stubs, routing scaffolds.

## Tech Stack

- __Frontend__
  - React 18 + TypeScript + Vite
  - Tailwind CSS, Framer Motion, Lucide Icons
  - React Router DOM 7
  - Markdown rendering & sanitization: `marked` + `dompurify`

- __Backend__
  - Flask 3, CORS via `flask-cors`
  - Agents using Ollama (default model: `mistral`) for drafting, judging, and synthesis
  - Embeddings: OpenAI or Ollama (`nomic-embed-text`)
  - Vector DB: Milvus (`pymilvus`)
  - Web search: Firecrawl REST API
  - Config: `.env`, `PyYAML`

## Installation & Setup

> Prereqs: Node 18+, Python 3.11+, Milvus running (or accessible), optional Ollama installed with the desired models, and (optionally) an OpenAI API key if using OpenAI embeddings.

### 1) Clone the repository

```bash
git clone <YOUR_REPO_URL>.git
cd AI Legal Agent
```

### 2) Backend setup

```bash
cd backend
python -m venv .venv
# Activate the venv
# Windows PowerShell
. .venv\Scripts\Activate.ps1
# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt

# Copy environment and configure
cp .env.example .env  # use an equivalent copy command on Windows (e.g., copy)
```

Set the following in `backend/.env` as needed:

```env
APP_PORT=8000
ALLOWED_ORIGINS=http://localhost:5173

# Milvus
MILVUS_HOST=localhost
MILVUS_PORT=19530
MILVUS_COLLECTION=legal_chunks

# LLM (Ollama)
OLLAMA_HOST=http://localhost:11434
OLLAMA_TIMEOUT=300

# Embeddings
EMBEDDINGS_BACKEND=openai  # or: ollama
OPENAI_API_KEY=sk-...      # required if using OpenAI embeddings
# Optional custom base URL (Azure/OpenAI-compatible endpoints)
# OPENAI_BASE_URL=https://your-endpoint/v1

# Firecrawl (optional for web augmentation)
FIRECRAWL_API_KEY=fc_...
```

Start the backend:

```bash
python main.py
# Backend runs on http://localhost:8000
```

> Note: The server registers blueprints for health, ask, and ingest. CORS is configured via `ALLOWED_ORIGINS`.

### 3) Frontend setup

```bash
cd ../frontend
npm install
npm run dev
# Vite dev server runs (typically) on http://localhost:5173
```

The frontend calls `POST http://localhost:8000/ask` by default. Adjust if your backend runs elsewhere.

### 4) Milvus prerequisites

- Ensure a Milvus collection exists with fields compatible with `retriever/ingest.py` and `retriever/milvus_client.py` expectations, including a vector field named `vector` and output fields `text`, `source`, `section`, `meta`.
- If you use Docker Compose for Milvus, wire it via `backend/infra/` (compose file present). Configure host/port accordingly.

### 5) Ollama models (optional, for LLM draft/judge/synthesis)

```bash
ollama pull mistral
# For embeddings if using Ollama backend
ollama pull nomic-embed-text
```

## Usage Guide

### Chat from the UI

- Visit the frontend in your browser (e.g., `http://localhost:5173`).
- Ask a legal question in the chat. The app will:
  1) Retrieve context from Milvus.
  2) Draft an answer (Paralegal agent).
  3) Judge coverage & grounding (Router agent), optionally perform Firecrawl search.
  4) Synthesize a final, structured, cited answer (Synthesizer agent).
- The right panel shows conversation history and context sources for the latest response.

> The “Upload document” UI currently simulates processing. To wire ingestion, see the API below.

### API Examples

- __Health__

```bash
curl http://localhost:8000/healthz
curl http://localhost:8000/readyz
```

- __Ask__ (`POST /ask`)

```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the statute of limitations for breach of contract in California?"}'
```

Response (shape):

```json
{
  "answer": "...final markdown answer...",
  "citations": [ {"source":"...","section":"..."}, {"url":"..."} ],
  "sources": [ {"source":"...","section":"...","score":0.87,"text":"..."} ],
  "web_sources": [ {"url":"...","title":"...","snippet":"..."} ],
  "routing": {"pass":true, "scores": {"coverage":5, "grounding":5, "citations":5, "freshness":4}},
  "timings": {}
}
```

- __Ingest__ (`POST /ingest`)

Inline texts:

```bash
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "source_uri": "inline",
    "options": {
      "source": "user_upload",
      "texts": ["Contract clause ...", "Another snippet ..."],
      "chunk_size": 800,
      "chunk_overlap": 100
    }
  }'
```

Directory of `.txt` files:

```bash
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "source_uri": "C:/path/to/folder",  # or /path/on/linux
    "options": {
      "chunk_size": 800,
      "chunk_overlap": 100
    }
  }'
```

Response (shape):

```json
{"job_id": "job-ok", "status": "queued"}
```

## Project Structure

```
AI Legal Agent/
├─ backend/
│  ├─ api/
│  │  ├─ routes_ask.py            # POST /ask pipeline orchestrator
│  │  ├─ routes_ingest.py         # POST /ingest for texts or directory
│  │  ├─ routes_health.py         # /healthz, /readyz
│  │  └─ deps.py                  # Lazy singletons for retriever/agents/clients
│  ├─ agents/
│  │  ├─ paralegal.py             # Drafting agent (Ollama)
│  │  ├─ router.py                # Judge/router agent (Ollama)
│  │  └─ synthesizer.py           # Final synthesis agent (Ollama)
│  ├─ retriever/
│  │  ├─ milvus_client.py         # Milvus top‑k retrieval
│  │  └─ ingest.py                # Chunk + embeddings + upsert to Milvus
│  ├─ tools/
│  │  ├─ embeddings.py            # OpenAI/Ollama embeddings backend
│  │  ├─ ollama_client.py         # Non-streaming Ollama generate API
│  │  └─ firecrawl_client.py      # Firecrawl search client
│  ├─ configs/
│  │  ├─ retrieval.yaml           # k default
│  │  ├─ milvus.yaml              # stub
│  │  ├─ firecrawl.yaml           # stub
│  │  └─ routing.yaml             # stub
│  ├─ main.py                     # Flask app, CORS, blueprint registration
│  ├─ requirements.txt
│  ├─ README.md                   # Backend-only quick start
│  └─ infra/                      # Docker compose or infra scaffolding
│
├─ frontend/
│  ├─ src/
│  │  ├─ pages/
│  │  │  ├─ ChatbotPage.tsx       # Main chat UI; calls POST /ask
│  │  │  ├─ HomePage.tsx, AuthPage.tsx, ContactPage.tsx, LegalLibraryPage.tsx
│  │  ├─ components/
│  │  │  ├─ ChatMessage.tsx       # Markdown + citations rendering
│  │  │  ├─ QuickActions.tsx, Navbar.tsx, Hero.tsx, Features.tsx, etc.
│  │  ├─ main.tsx, App.tsx, index.css
│  ├─ package.json, vite.config.ts, tailwind.config.js
│  └─ index.html
│
└─ README.md (this file)
```

## Configuration Notes

- __CORS__: Set `ALLOWED_ORIGINS` in `backend/.env` to your frontend dev server (e.g., `http://localhost:5173`).
- __Embeddings__: Choose `EMBEDDINGS_BACKEND=openai` or `ollama`. If `openai`, ensure `OPENAI_API_KEY` is set. Optional `EMBEDDINGS_FALLBACK=ollama` can be used.
- __Milvus__: Configure host/port/collection; ensure schema matches the code’s expectations.
- __Ollama__: Confirm `OLLAMA_HOST` and pull required models.
- __Firecrawl__: Optional; without a key, web fallback is skipped gracefully.

## Troubleshooting

- __CORS errors__: Verify `ALLOWED_ORIGINS` and browser console network logs.
- __Milvus search errors__: Ensure Milvus is up, collection exists, and embedding dimensionality matches the collection schema.
- __Ollama timeouts__: Increase `OLLAMA_TIMEOUT` or test with smaller prompts. Confirm the model is pulled and running.
- __OpenAI errors__: Check API key, quotas, and `OPENAI_BASE_URL` if using a compatible endpoint.

## Roadmap / Next Steps

- Wire frontend document upload to `POST /ingest` with progress UI.
- Add streaming responses (server-sent events) and incremental rendering.
- Provide Milvus schema init/migration scripts.
- Authentication (JWT) and rate limiting.
- Unit tests for agents and retriever.
