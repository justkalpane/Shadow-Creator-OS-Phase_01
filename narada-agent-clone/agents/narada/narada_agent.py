# Narada Data Ingestion Agent (v1)
# Fetches trending topics from multiple sources (stub + extensible)

import requests
from datetime import datetime

class NaradaAgent:
    def __init__(self):
        self.sources = [
            "https://trends.google.com/trends/api/dailytrends?hl=en-US&geo=US",
        ]

    def fetch_google_trends(self):
        try:
            r = requests.get(self.sources[0])
            return {"status": "ok", "data": r.text[:500]}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    def run(self):
        results = {
            "timestamp": datetime.utcnow().isoformat(),
            "google_trends": self.fetch_google_trends()
        }
        return results

if __name__ == "__main__":
    agent = NaradaAgent()
    print(agent.run())
