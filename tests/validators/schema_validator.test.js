import fs from 'fs';
import path from 'path';

describe('Schema Validator Tests', () => {
  test('all packet schemas are valid JSON', () => {
    const schemaDir = path.join(process.cwd(), 'schemas', 'packets');
    if (!fs.existsSync(schemaDir)) {
      console.log('schemas/packets directory not found, skipping test');
      return;
    }

    const schemas = fs.readdirSync(schemaDir).filter(f => f.endsWith('.schema.json'));

    expect(schemas.length).toBeGreaterThan(0);

    schemas.forEach(filename => {
      const filepath = path.join(schemaDir, filename);
      let content = fs.readFileSync(filepath, 'utf8');
      // Remove BOM if present
      if (content.charCodeAt(0) === 0xfeff) {
        content = content.slice(1);
      }
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  test('dossier schema is valid', () => {
    const filepath = path.join(process.cwd(), 'schemas', 'dossier', 'content_dossier.schema.json');
    if (!fs.existsSync(filepath)) {
      console.log('dossier schema not found, skipping test');
      return;
    }

    let content = fs.readFileSync(filepath, 'utf8');
    // Remove BOM if present
    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1);
    }
    const schema = JSON.parse(content);

    expect(schema).toHaveProperty('$schema');
    expect(schema).toHaveProperty('properties');
  });

  test('all schemas in schemas/dossier are valid JSON', () => {
    const schemaDir = path.join(process.cwd(), 'schemas', 'dossier');
    if (!fs.existsSync(schemaDir)) {
      console.log('schemas/dossier directory not found, skipping test');
      return;
    }

    const schemas = fs.readdirSync(schemaDir).filter(f => f.endsWith('.json'));

    schemas.forEach(filename => {
      const filepath = path.join(schemaDir, filename);
      const content = fs.readFileSync(filepath, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });
});
