#!/usr/bin/env node
/**
 * n8n Status Script
 * Probes the n8n instance running locally on http://localhost:5678.
 * Cross-platform (Windows-first compatible).
 */

const http = require('http');

const HOST = process.env.N8N_HOST || 'localhost';
const PORT = process.env.N8N_PORT || 5678;

const options = {
  hostname: HOST,
  port: PORT,
  path: '/healthz',
  method: 'GET',
  timeout: 3000
};

const request = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log(`n8n status: ${res.statusCode}`);
    if (body) console.log(body);
    process.exit(res.statusCode >= 200 && res.statusCode < 400 ? 0 : 1);
  });
});

request.on('error', (error) => {
  console.error(`n8n NOT REACHABLE at http://${HOST}:${PORT}`);
  console.error(`Reason: ${error.message}`);
  console.error('To start n8n locally, install via: npm install -g n8n  then run: n8n start');
  process.exit(1);
});

request.on('timeout', () => {
  request.destroy();
  console.error(`n8n probe timed out at http://${HOST}:${PORT}`);
  process.exit(1);
});

request.end();
