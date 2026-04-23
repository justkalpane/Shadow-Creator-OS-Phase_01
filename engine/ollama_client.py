from __future__ import annotations

import requests


class OllamaClient:
    def __init__(self, model: str = "llama3.2:3b", url: str = "http://localhost:11434/api/generate") -> None:
        self.model = model
        self.url = url

    def generate(self, prompt: str, timeout: int = 60) -> str:
        response = requests.post(
            self.url,
            json={"model": self.model, "prompt": prompt, "stream": False},
            timeout=timeout,
        )
        response.raise_for_status()
        return response.json().get("response", "")
