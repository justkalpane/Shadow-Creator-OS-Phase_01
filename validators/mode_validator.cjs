#!/usr/bin/env node
/**
 * Mode Validator
 * Validates registries/mode_registry.yaml structure and required modes.
 * Returns exit 0 on PASS, 1 on FAIL.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const repoRoot = path.resolve(__dirname, '..');
const modePath = path.join(repoRoot, 'registries', 'mode_registry.yaml');

const REQUIRED_USER_MODES = ['founder', 'creator', 'builder', 'operator'];

class ModeValidator {
  validate() {
    const errors = [];
    const warnings = [];

    if (!fs.existsSync(modePath)) {
      errors.push('registries/mode_registry.yaml is missing');
      return { passed: false, errors, warnings };
    }

    let content;
    try {
      const raw = fs.readFileSync(modePath, 'utf8');
      const docs = yaml.parseAllDocuments(raw);
      content = docs[0].toJSON();
    } catch (error) {
      errors.push(`YAML parse error: ${error.message}`);
      return { passed: false, errors, warnings };
    }

    if (!content || typeof content !== 'object') {
      errors.push('Empty or non-object root');
      return { passed: false, errors, warnings };
    }

    // Locate modes (canonical block name is mode_definitions; also accept legacy .modes / .user_modes)
    const modes =
      content.mode_definitions ||
      content.modes ||
      content.user_modes ||
      (content.user_facing_modes ? content.user_facing_modes.modes : null) ||
      null;

    if (!modes) {
      errors.push('No modes block found (expected .mode_definitions, .modes, or .user_modes)');
      return { passed: false, errors, warnings };
    }

    // Validate required user modes are present somewhere in registry text
    const raw = fs.readFileSync(modePath, 'utf8');
    REQUIRED_USER_MODES.forEach((modeName) => {
      const tokens = [
        `"${modeName}"`,
        `'${modeName}'`,
        `: ${modeName}`,
        `: "${modeName}"`,
        `${modeName}:`,
        `  ${modeName}:`,
        `\n${modeName}:`,
        `"${modeName.toUpperCase()}"`,
        `[${modeName}]`,
        `, ${modeName}`,
        `${modeName} `,
        `${modeName},`
      ];
      const found = tokens.some((t) => raw.includes(t));
      if (!found) {
        warnings.push(`User mode "${modeName}" not detected in registry text`);
      }
    });

    return {
      passed: errors.length === 0,
      errors,
      warnings,
      registry_id: content.registry_id || null
    };
  }
}

if (require.main === module) {
  const v = new ModeValidator();
  const result = v.validate();
  console.log('Mode Validator');
  console.log('='.repeat(50));
  console.log(`Status: ${result.passed ? 'PASS' : 'FAIL'}`);
  if (result.errors.length) {
    console.log('Errors:');
    result.errors.forEach((e) => console.log('  -', e));
  }
  if (result.warnings.length) {
    console.log('Warnings:');
    result.warnings.forEach((w) => console.log('  -', w));
  }
  process.exit(result.passed ? 0 : 1);
}

module.exports = ModeValidator;
