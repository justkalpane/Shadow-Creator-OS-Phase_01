const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function repoPath(...parts) {
  return path.join(__dirname, '..', ...parts);
}

function readJsonSafe(relPath, fallback) {
  try {
    const full = repoPath(relPath);
    if (!fs.existsSync(full)) return fallback;
    return JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch {
    return fallback;
  }
}

function readYamlSafe(relPath, fallback) {
  try {
    const full = repoPath(relPath);
    if (!fs.existsSync(full)) return fallback;
    return yaml.load(fs.readFileSync(full, 'utf8'));
  } catch {
    return fallback;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function writeJsonSafe(relPath, value) {
  const full = repoPath(relPath);
  const dir = path.dirname(full);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(full, JSON.stringify(value, null, 2), 'utf8');
}

module.exports = {
  repoPath,
  readJsonSafe,
  readYamlSafe,
  nowIso,
  writeJsonSafe,
};
