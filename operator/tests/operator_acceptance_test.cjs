const axios = require('axios');
const config = require('../config');

async function main() {
  const base = `http://localhost:${config.operatorPort}/operator`;
  const checks = [
    `${base}/health`,
    `${base}/modes`,
    `${base}/routes`,
    `${base}/alerts`,
    `${base}/events`,
    `${base}/tasks`,
  ];

  let failed = 0;
  for (const url of checks) {
    try {
      const res = await axios.get(url, { timeout: 8000 });
      console.log(`[PASS] ${url} -> ${res.status}`);
    } catch (err) {
      failed += 1;
      console.log(`[FAIL] ${url} -> ${err.message}`);
    }
  }

  if (failed > 0) process.exit(1);
  console.log('operator acceptance smoke: PASS');
  process.exit(0);
}

main();

