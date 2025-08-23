from typing import List, Dict, Any
import textwrap

from tools.ollama_client import generate as ollama_generate


def _format_rag(rag_ctx: List[Dict[str, Any]]) -> str:
    lines = []
    for i, c in enumerate(rag_ctx, 1):
        lines.append(f"[R{i}] {c.get('source','')} {c.get('section','')}:\n{c.get('text','')}")
    return "\n\n".join(lines[:15])


def _format_web(web_ctx: List[Dict[str, Any]]) -> str:
    lines = []
    for i, c in enumerate(web_ctx, 1):
        url = c.get("url") or ""
        title = c.get("title") or ""
        snip = c.get("snippet") or ""
        lines.append(f"[W{i}] {title} | {url}\n{snip}")
    return "\n\n".join(lines[:10])


class SynthesizerAgent:
    def __init__(self, model: str = "mistral"):
        self.model = model

    def synthesize(self, query: str, rag_ctx: List[Dict[str, Any]], web_ctx: List[Dict[str, Any]], draft: Dict[str, Any], verdict: Dict[str, Any]) -> Dict[str, Any]:
        rag_block = _format_rag(rag_ctx)
        web_block = _format_web(web_ctx)
        needs_web = not verdict.get("pass", False)
        web_section = f"WEB EVIDENCE:\n{web_block}" if needs_web else ""

        prompt = textwrap.dedent(
            f"""
            You are a senior legal writer. Produce a final, precise answer for the USER QUERY using the draft and evidence.
            Rules:
            - Be concise and accurate.
            - Ground claims strictly in the RAG and, if needed, WEB evidence. Avoid hallucinations.
            - Include inline bracket citations like [R1], [R2] and [W1] where appropriate.
            - If information is missing or outdated, explicitly state limitations.

            USER QUERY:
            {query}

            DRAFT (from paralegal):
            {draft.get('text','')}

            RAG EVIDENCE:
            {rag_block}

            {web_section}

            Final Answer:
            """
        ).strip()

        text = ollama_generate(self.model, prompt, temperature=0.2, max_tokens=700)

        merged_cites: List[Dict[str, Any]] = []
        for c in rag_ctx:
            merged_cites.append({"source": c.get("source"), "section": c.get("section")})
        for c in web_ctx:
            merged_cites.append({"url": c.get("url")})

        return {"text": text, "citations": merged_cites, "timings": {}}
