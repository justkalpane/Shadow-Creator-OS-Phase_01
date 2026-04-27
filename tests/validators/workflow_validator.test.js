import fs from 'fs';
import path from 'path';

describe('Workflow Validator Tests', () => {
  test('all workflow JSONs are valid', () => {
    const workflowDir = path.join(process.cwd(), 'n8n', 'workflows');
    const workflows = fs.readdirSync(workflowDir).filter(f => f.endsWith('.json'));

    expect(workflows.length).toBeGreaterThan(0);

    workflows.forEach(filename => {
      const filepath = path.join(workflowDir, filename);
      const content = fs.readFileSync(filepath, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  test('all workflows have required fields', () => {
    const workflowDir = path.join(process.cwd(), 'n8n', 'workflows');
    const workflows = fs.readdirSync(workflowDir).filter(f => f.endsWith('.json'));

    workflows.forEach(filename => {
      const filepath = path.join(workflowDir, filename);
      const workflow = JSON.parse(fs.readFileSync(filepath, 'utf8'));

      expect(workflow).toHaveProperty('name');
      expect(workflow).toHaveProperty('nodes');
      expect(Array.isArray(workflow.nodes)).toBe(true);
    });
  });

  test('should have at least 31 workflows', () => {
    const workflowDir = path.join(process.cwd(), 'n8n', 'workflows');
    const workflows = fs.readdirSync(workflowDir).filter(f => f.endsWith('.json'));

    expect(workflows.length).toBeGreaterThanOrEqual(31);
  });
});
