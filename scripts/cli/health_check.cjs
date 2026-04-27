#!/usr/bin/env node
/**
 * Health Check Script
 * Verifies critical system components: registries, workflows, schemas, validators.
 * Returns exit code 0 if healthy, 1 if any component is unhealthy.
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');

const checks = [
  {
    name: 'package.json',
    test: () => fs.existsSync(path.join(repoRoot, 'package.json'))
  },
  {
    name: 'registries directory',
    test: () => fs.existsSync(path.join(repoRoot, 'registries'))
  },
  {
    name: 'skill_registry.yaml',
    test: () => fs.existsSync(path.join(repoRoot, 'registries', 'skill_registry.yaml'))
  },
  {
    name: 'workflow_registry.yaml',
    test: () => fs.existsSync(path.join(repoRoot, 'registries', 'workflow_registry.yaml'))
  },
  {
    name: 'n8n/workflows directory',
    test: () => fs.existsSync(path.join(repoRoot, 'n8n', 'workflows'))
  },
  {
    name: 'schemas/dossier/content_dossier.schema.json',
    test: () => fs.existsSync(path.join(repoRoot, 'schemas', 'dossier', 'content_dossier.schema.json'))
  },
  {
    name: 'validators/workflow_validator.cjs',
    test: () => fs.existsSync(path.join(repoRoot, 'validators', 'workflow_validator.cjs'))
  },
  {
    name: 'engine/dossier/dossier_writer.js',
    test: () => fs.existsSync(path.join(repoRoot, 'engine', 'dossier', 'dossier_writer.js'))
  },
  {
    name: 'engine/skill_loader/skill_loader.js',
    test: () => fs.existsSync(path.join(repoRoot, 'engine', 'skill_loader', 'skill_loader.js'))
  },
  {
    name: 'data/se_packet_index.json',
    test: () => fs.existsSync(path.join(repoRoot, 'data', 'se_packet_index.json'))
  }
];

console.log('Shadow Creator OS - Health Check');
console.log('='.repeat(50));

let allHealthy = true;
checks.forEach((check) => {
  const ok = check.test();
  console.log(`${ok ? '[OK]' : '[FAIL]'} ${check.name}`);
  if (!ok) allHealthy = false;
});

console.log('='.repeat(50));
console.log(`STATUS: ${allHealthy ? 'HEALTHY' : 'UNHEALTHY'}`);
process.exit(allHealthy ? 0 : 1);
