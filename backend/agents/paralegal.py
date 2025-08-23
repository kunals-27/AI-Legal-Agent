from typing import List, Dict, Any
import textwrap

from tools.ollama_client import generate as ollama_generate


def _format_context(ctx: List[Dict[str, Any]]) -> str:
    lines = []
    for i, c in enumerate(ctx, 1):
        src = c.get("source") or ""
        sec = c.get("section") or ""
        txt = c.get("text") or ""
        lines.append(f"[{i}] source={src} section={sec}\n{txt}")
    return "\n\n".join(lines[:20])


class ParalegalAgent:
    def __init__(self, model: str = "mistral"):
        self.model = model

    def generate(self, query: str, context: List[Dict[str, Any]]) -> Dict[str, Any]:
        ctx_block = _format_context(context)
        prompt = textwrap.dedent(
            f"""
            You are a meticulous paralegal. Using ONLY the provided context, draft a concise answer to the query.
            - Cite passages using bracketed indices like [1], [2] referring to the context items.
            - If the answer is uncertain or not covered, say so explicitly.

            Query:
            {query}

            Context:
            {ctx_block}

            Draft:
            """
        ).strip()

        text = ollama_generate(self.model, prompt, temperature=0.2, max_tokens=512)
        cites = [{"source": c.get("source"), "section": c.get("section")} for c in context]
        return {"text": text, "citations": cites}
