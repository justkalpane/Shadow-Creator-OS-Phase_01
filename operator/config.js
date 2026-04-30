module.exports = {
  operatorPort: Number(process.env.OPERATOR_PORT || 5050),
  n8nBaseUrl: process.env.N8N_BASE_URL || 'http://localhost:5678',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  repoRoot: process.env.SHADOW_REPO_ROOT || 'C:/ShadowEmpire-Git',
};

