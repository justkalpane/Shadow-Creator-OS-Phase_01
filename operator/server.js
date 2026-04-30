const express = require('express');
const cors = require('cors');
const createOperatorRouter = require('../engine/api/operator');
const config = require('./config');
const logger = require('./logger');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'shadow_operator_core',
    port: config.operatorPort,
    n8n_base_url: config.n8nBaseUrl,
    ollama_base_url: config.ollamaBaseUrl,
    timestamp: new Date().toISOString(),
  });
});

app.use('/operator', createOperatorRouter());

app.listen(config.operatorPort, () => {
  logger.log('operator-server', `Listening on http://localhost:${config.operatorPort}`);
});

