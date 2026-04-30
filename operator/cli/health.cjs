const axios = require('axios');
const config = require('../config');

async function run() {
  const url = `http://localhost:${config.operatorPort}/operator/health`;
  try {
    const res = await axios.get(url, { timeout: 5000 });
    console.log(`operator health: ${res.status}`);
    console.log(JSON.stringify(res.data, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(`operator health failed: ${err.message}`);
    if (err.response) {
      console.error(`status=${err.response.status}`);
      console.error(JSON.stringify(err.response.data, null, 2));
    }
    process.exit(1);
  }
}

run();

