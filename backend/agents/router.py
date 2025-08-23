from typing import List, Dict, Any
import json
import textwrap

from tools.ollama_client import generate as ollama_generate


class RouterAgent:
    def __init__(self, model: str = "mistral"):
        self.model = model

    def evaluate(self, query: str, draft: Dict[str, Any], context: List[Dict[str, Any]]) -> Dict[str, Any]:
        # Simple rubric enforced via JSON output
        rubric = textwrap.dedent(
            """
            You are a strict legal QA judge. Score the DRAFT answer against the CONTEXT for:
            - coverage: Does it answer the user question fully? (0-5)
            - grounding: Is every claim supported by the provided context? (0-5)
            - citations: Are sources cited sufficiently and appropriately? (0-5)
            - freshness: Is the information likely up-to-date given the query? (0-5)
            Output only JSON with fields: {
              "pass": boolean,  // pass if average>=4 and no dimension<3
              "scores": {"coverage": int, "grounding": int, "citations": int, "freshness": int},
              "notes": string
            }
            """
        ).strip()

        ctx_preview = "\n\n".join([(c.get("text") or "")[:500] for c in context[:5]])
        prompt = f"{rubric}\n\nUSER QUERY:\n{query}\n\nCONTEXT (snippets):\n{ctx_preview}\n\nDRAFT:\n{draft.get('text','')}\n\nJSON:".strip()

        raw = ollama_generate(self.model, prompt, temperature=0.0, max_tokens=256)
        try:
            obj = json.loads(raw.strip().splitlines()[-1])
            scores = obj.get("scores", {})
            avg = sum(scores.get(k, 0) for k in ["coverage", "grounding", "citations", "freshness"]) / 4.0
            passed = bool(obj.get("pass", False)) and all(scores.get(k, 0) >= 3 for k in scores) and avg >= 4
            obj["pass"] = passed
            return obj
        except Exception:
            return {"pass": False, "scores": {"coverage": 0, "grounding": 0, "citations": 0, "freshness": 0}, "notes": "judge_parse_error"}
