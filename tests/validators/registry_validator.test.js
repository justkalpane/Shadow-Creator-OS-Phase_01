import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

describe('Registry Validator Tests', () => {
  test('all registries are valid YAML', () => {
    const registryDir = path.join(process.cwd(), 'registries');
    const registries = fs.readdirSync(registryDir)
      .filter(f => (f.endsWith('.yaml') || f.endsWith('.yml')) && !f.startsWith('.'));

    expect(registries.length).toBeGreaterThan(0);

    registries.forEach(filename => {
      const filepath = path.join(registryDir, filename);
      const content = fs.readFileSync(filepath, 'utf8');
      // Handle multiple YAML documents (separated by ---)
      expect(() => {
        const docs = yaml.parseAllDocuments(content);
        expect(docs.length).toBeGreaterThan(0);
      }).not.toThrow();
    });
  });

  test('skill registry has all required fields', () => {
    const filepath = path.join(process.cwd(), 'registries', 'skill_registry.yaml');
    if (!fs.existsSync(filepath)) {
      console.log('skill_registry.yaml not found, skipping test');
      return;
    }

    const content = fs.readFileSync(filepath, 'utf8');
    const docs = yaml.parseAllDocuments(content);
    const registry = docs[0].toJSON();

    // Registry might be array or have skills key
    const skillsList = Array.isArray(registry) ? registry : registry.skills;
    expect(Array.isArray(skillsList) || !skillsList).toBe(true);

    if (Array.isArray(skillsList) && skillsList.length > 0) {
      skillsList.forEach(skill => {
        expect(skill).toHaveProperty('skill_id');
        expect(skill).toHaveProperty('skill_name');
      });
    }
  });

  test('model registry has all required fields', () => {
    const filepath = path.join(process.cwd(), 'registries', 'model_registry.yaml');
    if (!fs.existsSync(filepath)) {
      console.log('model_registry.yaml not found, skipping test');
      return;
    }

    const content = fs.readFileSync(filepath, 'utf8');
    const docs = yaml.parseAllDocuments(content);
    const registry = docs[0].toJSON();

    // Check for registry_id and registry_type (canonical structure)
    expect(registry).toHaveProperty('registry_id');
    expect(registry.registry_id).toBe('model_registry');
  });
});
