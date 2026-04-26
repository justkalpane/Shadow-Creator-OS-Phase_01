const fs = require('fs');
const path = require('path');

const REQUIRED_CHAIN = [
  'CWF-110',
  'CWF-120',
  'CWF-130',
  'CWF-140',
  'CWF-210',
  'CWF-220',
  'CWF-230',
  'CWF-240',
  'WF-020'
];

function loadWorkflow(workflowId) {
  const filePath = path.resolve('n8n/workflows', `${workflowId}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing canonical workflow file: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function findNode(workflow, nodeName) {
  const node = (workflow.nodes || []).find((row) => row.name === nodeName);
  if (!node) {
    throw new Error(`Node "${nodeName}" not found in workflow ${workflow.meta?.workflow_id || workflow.name}`);
  }
  return node;
}

function runCodeNode(node, inputJson) {
  const jsCode = node.parameters?.jsCode;
  if (typeof jsCode !== 'string') {
    throw new Error(`Node "${node.name}" does not contain parameters.jsCode`);
  }
  const fn = new Function('$json', jsCode);
  return fn(inputJson);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function verifyMetaChain() {
  const traversed = [];
  let current = 'CWF-110';
  let guard = 0;
  while (current && guard < 30) {
    guard += 1;
    traversed.push(current);
    if (current === 'WF-020') break;
    const workflow = loadWorkflow(current);
    current = workflow.meta?.next_workflow;
  }

  assert(
    REQUIRED_CHAIN.every((workflowId) => traversed.includes(workflowId)),
    `Canonical chain mismatch. Traversed=${JSON.stringify(traversed)}`
  );
  assert(traversed[traversed.length - 1] === 'WF-020', 'Topic intake chain did not terminate at WF-020');

  return traversed;
}

function verifyCwf140Branching() {
  const workflow = loadWorkflow('CWF-140');
  const routingNode = findNode(workflow, 'Next-Stage Routing Node');
  const errorNode = findNode(workflow, 'Error Routing WF-900 Node');

  const highConfidence = runCodeNode(routingNode, {
    route_to_error: false,
    runtime_packet: {
      payload: {
        research_confidence_score: 0.91
      }
    }
  });
  const lowConfidence = runCodeNode(routingNode, {
    route_to_error: false,
    runtime_packet: {
      payload: {
        research_confidence_score: 0.62
      }
    }
  });
  const forcedError = runCodeNode(errorNode, {
    route_to_error: true,
    validation_error: 'simulated packet validation failure',
    runtime: { error_message: 'simulated runtime failure' },
    runtime_packet: { instance_id: 'PKT-SIM-140-ERR' }
  });

  const highNext = highConfidence?.[0]?.json?.routing_decision?.on_success_next_workflow;
  const lowNext = lowConfidence?.[0]?.json?.routing_decision?.on_success_next_workflow;
  const errorRoute = forcedError?.[0]?.json?.route_to_workflow;

  assert(highNext === 'CWF-210', `CWF-140 high-confidence branch expected CWF-210, got ${highNext}`);
  assert(lowNext === 'CWF-140', `CWF-140 low-confidence branch expected CWF-140, got ${lowNext}`);
  assert(errorRoute === 'WF-900', `CWF-140 error branch expected WF-900, got ${errorRoute}`);

  return { highNext, lowNext, errorRoute };
}

function verifyWf020Branching() {
  const workflow = loadWorkflow('WF-020');
  const routingNode = findNode(workflow, 'Next-Stage Routing Node');
  const errorNode = findNode(workflow, 'Error Routing WF-900 Node');

  const approved = runCodeNode(routingNode, {
    route_to_error: false,
    runtime_packet: { payload: { approval_decision: 'APPROVED' } }
  });
  const rejected = runCodeNode(routingNode, {
    route_to_error: false,
    runtime_packet: { payload: { approval_decision: 'REJECTED' } }
  });
  const forcedError = runCodeNode(errorNode, {
    route_to_error: true,
    validation_error: 'simulated approval validation failure',
    runtime: { error_message: 'simulated approval runtime failure' },
    runtime_packet: { instance_id: 'PKT-SIM-020-ERR' }
  });

  const approvedNext = approved?.[0]?.json?.routing_decision?.on_success_next_workflow;
  const rejectedNext = rejected?.[0]?.json?.routing_decision?.on_success_next_workflow;
  const errorRoute = forcedError?.[0]?.json?.route_to_workflow;

  assert(approvedNext === 'WF-300', `WF-020 approved branch expected WF-300, got ${approvedNext}`);
  assert(rejectedNext === 'WF-021', `WF-020 rejected branch expected WF-021, got ${rejectedNext}`);
  assert(errorRoute === 'WF-900', `WF-020 error branch expected WF-900, got ${errorRoute}`);

  return { approvedNext, rejectedNext, errorRoute };
}

function verifyWf021Branching() {
  const workflow = loadWorkflow('WF-021');
  const routingNode = findNode(workflow, 'Next-Stage Routing Node');
  const errorNode = findNode(workflow, 'Error Routing WF-900 Node');

  const replay = runCodeNode(routingNode, {
    route_to_error: false,
    replay_target_workflow: 'CWF-220',
    runtime_packet: { payload: {} }
  });
  const forcedError = runCodeNode(errorNode, {
    route_to_error: true,
    validation_error: 'simulated replay validation failure',
    runtime: { error_message: 'simulated replay runtime failure' },
    runtime_packet: { instance_id: 'PKT-SIM-021-ERR' }
  });

  const replayNext = replay?.[0]?.json?.routing_decision?.on_success_next_workflow;
  const errorRoute = forcedError?.[0]?.json?.route_to_workflow;

  assert(replayNext === 'CWF-220', `WF-021 replay branch expected CWF-220, got ${replayNext}`);
  assert(errorRoute === 'WF-900', `WF-021 error branch expected WF-900, got ${errorRoute}`);

  return { replayNext, errorRoute };
}

function main() {
  const startedAt = new Date().toISOString();
  const chain = verifyMetaChain();
  const cwf140 = verifyCwf140Branching();
  const wf020 = verifyWf020Branching();
  const wf021 = verifyWf021Branching();

  const report = {
    status: 'PASSED',
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    verification: {
      topic_intake_chain_to_wf020: chain,
      cwf140_confidence_gate: cwf140,
      wf020_approval_gate: wf020,
      wf021_replay_gate: wf021
    }
  };

  const reportDir = path.resolve('tests/reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  const reportPath = path.join(reportDir, 'phase1_end_to_end_verification.json');
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('[PHASE1_END_TO_END_VERIFICATION_FAILED]', error.message);
    process.exitCode = 1;
  }
}
