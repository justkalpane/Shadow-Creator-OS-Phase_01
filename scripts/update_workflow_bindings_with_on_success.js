const fs = require('fs');
const path = require('path');

/**
 * Update workflow_bindings.yaml to add on_success routes for all 218 skills
 * Routing logic:
 * - M-001 to M-010: CWF-110 → CWF-110 (internal iteration)
 * - M-011 to M-020: CWF-110 → CWF-120 (topic qualification)
 * - M-021 to M-040: CWF-120 → CWF-130 (topic scoring)
 * - M-041 to M-080: CWF-130 → CWF-140 (research synthesis)
 * - M-081 to M-120: CWF-140 → CWF-210 (script generation)
 * - M-121 to M-150: CWF-210 → CWF-220 (script debate)
 * - M-151 to M-180: CWF-220 → CWF-230 (script refinement)
 * - M-181 to M-218: CWF-230 → CWF-240 (final shaping)
 */

function getNextWorkflow(skillNum, currentWorkflow) {
  if (skillNum >= 1 && skillNum <= 10) {
    return 'CWF-110'; // Stay in topic discovery
  } else if (skillNum >= 11 && skillNum <= 20) {
    return currentWorkflow === 'CWF-110' ? 'CWF-120' : 'CWF-120'; // Move to qualification
  } else if (skillNum >= 21 && skillNum <= 40) {
    return 'CWF-130'; // Topic scoring
  } else if (skillNum >= 41 && skillNum <= 80) {
    return 'CWF-140'; // Research synthesis
  } else if (skillNum >= 81 && skillNum <= 120) {
    return 'CWF-210'; // Script generation
  } else if (skillNum >= 121 && skillNum <= 150) {
    return 'CWF-220'; // Script debate
  } else if (skillNum >= 151 && skillNum <= 180) {
    return 'CWF-230'; // Script refinement
  } else {
    return 'CWF-240'; // Final shaping
  }
}

async function updateWorkflowBindings() {
  const bindingsPath = path.resolve('./registries/workflow_bindings.yaml');
  const content = fs.readFileSync(bindingsPath, 'utf8');

  const lines = content.split('\n');
  const updatedLines = [];
  let inBindings = false;
  let currentBinding = null;
  let inRouting = false;
  let routingIndent = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^\s*bindings:\s*$/.test(line)) {
      inBindings = true;
      updatedLines.push(line);
      continue;
    }

    if (inBindings && /^\s*-\s*skill_id:\s*(M-\d{3})/.test(line)) {
      const match = line.match(/(M-\d{3})/);
      const skillId = match ? match[1] : null;
      const skillNum = parseInt(skillId.replace(/[^0-9]/g, ''));

      currentBinding = {
        skillId,
        skillNum,
        startLine: i,
        lines: [line]
      };
      updatedLines.push(line);
      continue;
    }

    if (currentBinding && /^\s*workflow_id:\s*/.test(line)) {
      const match = line.match(/(CWF-\d{3}|WF-\d{3})/);
      currentBinding.workflow = match ? match[1] : null;
      updatedLines.push(line);
      continue;
    }

    if (currentBinding && /^\s*emitted_packet_family:\s*/.test(line)) {
      updatedLines.push(line);
      continue;
    }

    if (currentBinding && /^\s*routing:\s*$/.test(line)) {
      inRouting = true;
      routingIndent = line.match(/^(\s*)/)[1];
      updatedLines.push(line);
      continue;
    }

    if (inRouting && /^\s*on_error:\s*/.test(line)) {
      updatedLines.push(line);
      continue;
    }

    if (inRouting && /^\s*on_replay:\s*/.test(line)) {
      updatedLines.push(line);
      // After on_replay, add on_success
      const nextWorkflow = getNextWorkflow(currentBinding.skillNum, currentBinding.workflow);
      const packetFamily = `m${String(currentBinding.skillNum).padStart(3, '0')}_packet`;
      const onSuccessLine = `${routingIndent}  on_success: ${nextWorkflow}`;
      updatedLines.push(onSuccessLine);
      inRouting = false;
      currentBinding = null;
      continue;
    }

    // If we encounter a new binding entry or end of bindings section while in routing, close the binding
    if (inRouting && (line.match(/^\s*-\s*skill_id:/) || !line.match(/^\s+/))) {
      // Add on_success before closing
      if (currentBinding) {
        const nextWorkflow = getNextWorkflow(currentBinding.skillNum, currentBinding.workflow);
        const onSuccessLine = `${routingIndent}  on_success: ${nextWorkflow}`;
        updatedLines.push(onSuccessLine);
      }
      inRouting = false;
      currentBinding = null;

      if (line.match(/^\s*-\s*skill_id:/)) {
        // Process new binding
        const match = line.match(/(M-\d{3})/);
        const skillId = match ? match[1] : null;
        const skillNum = parseInt(skillId.replace(/[^0-9]/g, ''));
        currentBinding = { skillId, skillNum, workflow: null };
        updatedLines.push(line);
        continue;
      }
    }

    updatedLines.push(line);
  }

  // Handle last binding if in routing
  if (inRouting && currentBinding) {
    const nextWorkflow = getNextWorkflow(currentBinding.skillNum, currentBinding.workflow);
    const onSuccessLine = `${routingIndent}  on_success: ${nextWorkflow}`;
    updatedLines.push(onSuccessLine);
  }

  const updated = updatedLines.join('\n');
  fs.writeFileSync(bindingsPath, updated, 'utf8');
  console.log('✓ Updated workflow_bindings.yaml with on_success routes for all 218 skills');
}

updateWorkflowBindings().catch(err => {
  console.error('Error updating workflow bindings:', err.message);
  process.exit(1);
});
