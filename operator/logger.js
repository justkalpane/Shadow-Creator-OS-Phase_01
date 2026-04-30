function log(scope, message, meta = null) {
  const stamp = new Date().toISOString();
  if (meta) {
    console.log(`[${stamp}] [${scope}] ${message}`, meta);
  } else {
    console.log(`[${stamp}] [${scope}] ${message}`);
  }
}

function error(scope, message, meta = null) {
  const stamp = new Date().toISOString();
  if (meta) {
    console.error(`[${stamp}] [${scope}] ${message}`, meta);
  } else {
    console.error(`[${stamp}] [${scope}] ${message}`);
  }
}

module.exports = { log, error };

