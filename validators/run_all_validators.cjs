#!/usr/bin/env node
/**
 * Aggregate Validator (Substantive)
 * Executes runFullCheck() on all validator classes; aggregates findings; exits non-zero on any error-severity finding.
 *
 * This is NOT a count-only validator. It executes:
 *   - WorkflowValidator.runFullCheck()
 *   - SchemaValidator.runFullCheck()
 *   - RegistryValidator.runFullCheck()
 *   - RuntimeValidator.runFullCheck() (if present)
 *   - ModelValidator.validate()
 *   - ModeValidator.validate()
 *   - Dossier runtime model validation
 *
 * Each result is summarized with overall_valid, finding count, and selected findings.
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

const validators = [
  {
    name: 'WorkflowValidator',
    load: () => require('./workflow_validator.cjs'),
    run: (Cls) => new Cls().runFullCheck()
  },
  {
    name: 'SchemaValidator',
    load: () => require('./schema_validator.cjs'),
    run: (Cls) => new Cls().runFullCheck()
  },
  {
    name: 'RegistryValidator',
    load: () => require('./registry_validator.cjs'),
    run: (Cls) => new Cls().runFullCheck()
  },
  {
    name: 'ModelValidator',
    load: () => require('./model_validator.cjs'),
    run: (Cls) => {
      const r = new Cls().validate();
      return {
        overall_valid: r.passed,
        findings: (r.errors || []).map((m) => ({ severity: 'error', code: 'MODEL_REGISTRY', message: m }))
          .concat((r.warnings || []).map((m) => ({ severity: 'warning', code: 'MODEL_REGISTRY', message: m })))
      };
    }
  },
  {
    name: 'ModeValidator',
    load: () => require('./mode_validator.cjs'),
    run: (Cls) => {
      const r = new Cls().validate();
      return {
        overall_valid: r.passed,
        findings: (r.errors || []).map((m) => ({ severity: 'error', code: 'MODE_REGISTRY', message: m }))
          .concat((r.warnings || []).map((m) => ({ severity: 'warning', code: 'MODE_REGISTRY', message: m })))
      };
    }
  }
];

// Optional runtime validator (uses different shape; treat exceptions as warnings)
function tryRuntimeValidator() {
  try {
    const Cls = require('./runtime_validator.cjs');
    if (typeof Cls === 'function') {
      const inst = new Cls();
      if (typeof inst.runFullCheck === 'function') {
        return inst.runFullCheck();
      }
    }
    return null;
  } catch (error) {
    return { overall_valid: true, findings: [{ severity: 'warning', code: 'RUNTIME_VALIDATOR', message: `optional check skipped: ${error.message}` }] };
  }
}

// Dossier runtime model check
function dossierRuntimeCheck() {
  const dossierDir = path.join(repoRoot, 'dossiers');
  const findings = [];
  if (!fs.existsSync(dossierDir)) {
    return { overall_valid: true, findings: [{ severity: 'warning', code: 'DOSSIER_DIR', message: 'dossiers/ not present' }] };
  }
  const files = fs.readdirSync(dossierDir).filter((f) => f.endsWith('.json'));
  files.forEach((file) => {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(dossierDir, file), 'utf8'));
      if (!d.dossier_id) findings.push({ severity: 'error', code: 'DOSSIER_RUNTIME', message: `${file}: missing dossier_id` });
      if (typeof d._version !== 'number') findings.push({ severity: 'error', code: 'DOSSIER_RUNTIME', message: `${file}: missing/invalid _version` });
      if (!d._created_at) findings.push({ severity: 'error', code: 'DOSSIER_RUNTIME', message: `${file}: missing _created_at` });
      if (!Array.isArray(d._audit_trail)) findings.push({ severity: 'error', code: 'DOSSIER_RUNTIME', message: `${file}: missing _audit_trail array` });
    } catch (error) {
      findings.push({ severity: 'error', code: 'DOSSIER_PARSE', message: `${file}: ${error.message}` });
    }
  });
  const errors = findings.filter((f) => f.severity === 'error');
  return { overall_valid: errors.length === 0, findings };
}

console.log('Shadow Creator OS Phase-1: Substantive Validation');
console.log('='.repeat(70));

const results = [];

validators.forEach((spec, idx) => {
  console.log(`\n[${idx + 1}/${validators.length + 2}] ${spec.name}`);
  try {
    const Cls = spec.load();
    const result = spec.run(Cls);
    const errCount = (result.findings || []).filter((f) => f.severity === 'error').length;
    const warnCount = (result.findings || []).filter((f) => f.severity === 'warning').length;
    results.push({ name: spec.name, valid: !!result.overall_valid, errors: errCount, warnings: warnCount, findings: result.findings || [] });
    console.log(`   overall_valid=${result.overall_valid} errors=${errCount} warnings=${warnCount}`);
  } catch (error) {
    results.push({ name: spec.name, valid: false, errors: 1, warnings: 0, findings: [{ severity: 'error', code: 'VALIDATOR_CRASH', message: error.message }] });
    console.log(`   CRASHED: ${error.message}`);
  }
});

console.log(`\n[${validators.length + 1}/${validators.length + 2}] RuntimeValidator (optional)`);
const runtimeResult = tryRuntimeValidator();
if (runtimeResult) {
  const errCount = (runtimeResult.findings || []).filter((f) => f.severity === 'error').length;
  const warnCount = (runtimeResult.findings || []).filter((f) => f.severity === 'warning').length;
  results.push({ name: 'RuntimeValidator', valid: !!runtimeResult.overall_valid, errors: errCount, warnings: warnCount, findings: runtimeResult.findings || [] });
  console.log(`   overall_valid=${runtimeResult.overall_valid} errors=${errCount} warnings=${warnCount}`);
} else {
  console.log('   skipped (no runFullCheck export)');
}

console.log(`\n[${validators.length + 2}/${validators.length + 2}] DossierRuntimeCheck`);
const drc = dossierRuntimeCheck();
const drcErrCount = drc.findings.filter((f) => f.severity === 'error').length;
const drcWarnCount = drc.findings.filter((f) => f.severity === 'warning').length;
results.push({ name: 'DossierRuntimeCheck', valid: drc.overall_valid, errors: drcErrCount, warnings: drcWarnCount, findings: drc.findings });
console.log(`   overall_valid=${drc.overall_valid} errors=${drcErrCount} warnings=${drcWarnCount}`);

// Final summary
console.log('\n' + '='.repeat(70));
console.log('SUBSTANTIVE VALIDATION SUMMARY');
console.log('='.repeat(70));

let allPassed = true;
let totalErrors = 0;
let totalWarnings = 0;
results.forEach((r) => {
  const tag = r.valid ? 'PASS' : 'FAIL';
  console.log(`[${tag}] ${r.name.padEnd(24)} errors=${r.errors} warnings=${r.warnings}`);
  if (!r.valid) allPassed = false;
  totalErrors += r.errors;
  totalWarnings += r.warnings;
});

// Show first few error findings for context
const errorFindings = results.flatMap((r) => r.findings.filter((f) => f.severity === 'error').map((f) => ({ source: r.name, ...f })));
if (errorFindings.length > 0) {
  console.log('\nTop errors:');
  errorFindings.slice(0, 15).forEach((f) => console.log(`  [${f.source}] ${f.code}: ${f.message}`));
  if (errorFindings.length > 15) {
    console.log(`  ... and ${errorFindings.length - 15} more error findings`);
  }
}

console.log('='.repeat(70));
console.log(`OVERALL: ${allPassed ? 'PASS' : 'FAIL'} | total_errors=${totalErrors} total_warnings=${totalWarnings}`);
console.log('='.repeat(70));

process.exit(allPassed ? 0 : 1);
