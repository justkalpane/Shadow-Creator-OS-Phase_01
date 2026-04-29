const fs = require('fs');
const path = require('path');

/**
 * Update all child workflow Skill Execution Nodes to call real skill_loader
 * instead of generating synthetic packets
 */

const skillExecutionCode = `try {
  const SkillLoader = require('../../../engine/skill_loader/skill_loader.js');
  const loader = new SkillLoader();

  // Initialize loader if not already done
  if (!loader.skills_registry || Object.keys(loader.skills_registry).length === 0) {
    const initResult = await loader.initialize();
    if (initResult.status !== 'initialized') {
      throw new Error('Failed to initialize SkillLoader');
    }
  }

  // Get skill_id from input or workflow context
  const skillId = $json.skill_id || 'M-001';
  const dossierId = $json.dossier_context?.dossier_id || $json.dossier_id || 'DOSSIER-UNSPECIFIED';

  // Build context packet
  const contextPacket = {
    dossier_id: dossierId,
    ...(typeof $json.user_context === 'object' ? $json.user_context : {}),
    ...(typeof $json.route_context === 'object' ? $json.route_context : {})
  };

  // Build dossier state
  const dossierState = typeof $json.dossier === 'object' ? $json.dossier : {};

  // Execute skill
  const result = await loader.executeSkill(skillId, contextPacket, dossierState);

  // Return result
  if (result.status === 'SUCCESS') {
    return [{
      json: {
        ...$json,
        runtime_packet: result.output,
        skill_execution_result: result,
        runtime: { had_error: false, error_message: '' }
      }
    }];
  } else {
    throw new Error(\`Skill execution failed: \${result.error}\`);
  }
} catch (error) {
  // Strict mode: never synthesize runtime packets in production path
  const message = String(error && error.message ? error.message : error);
  return [{
    json: {
      ...$json,
      runtime_packet: null,
      skill_execution_result: null,
      runtime: { had_error: true, error_message: message }
    }
  }];
}`;

const workflowIds = ['CWF-110', 'CWF-120', 'CWF-130', 'CWF-140', 'CWF-210', 'CWF-220', 'CWF-230', 'CWF-240'];

async function updateWorkflows() {
  for (const workflowId of workflowIds) {
    const workflowPath = path.resolve(`./n8n/workflows/${workflowId}.json`);

    if (!fs.existsSync(workflowPath)) {
      console.log(`✗ ${workflowId}: File not found`);
      continue;
    }

    try {
      const content = fs.readFileSync(workflowPath, 'utf8');
      const workflow = JSON.parse(content);

      // Find and update Skill Execution Node
      const skillExecNode = workflow.nodes.find(
        (node) => node.name === 'Skill Execution Node' || node.id.includes('skill_execution_node')
      );

      if (!skillExecNode) {
        console.log(`✗ ${workflowId}: Skill Execution Node not found`);
        continue;
      }

      // Update jsCode
      skillExecNode.parameters.jsCode = skillExecutionCode;

      // Write back
      fs.writeFileSync(workflowPath, JSON.stringify(workflow, null, 2), 'utf8');
      console.log(`✓ ${workflowId}: Updated Skill Execution Node`);
    } catch (error) {
      console.error(`✗ ${workflowId}: ${error.message}`);
    }
  }

  console.log('\n✓ All workflow Skill Execution Nodes updated to call real skill_loader');
}

updateWorkflows().catch((err) => {
  console.error('Error updating workflows:', err.message);
  process.exit(1);
});
