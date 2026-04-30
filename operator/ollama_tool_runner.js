const TaskRouter = require('./task_router');
const axios = require('axios');
const readline = require('readline');

class OllamaToolRunner {
  constructor(modeManager, n8nClient) {
    this.taskRouter = new TaskRouter();
    this.modeManager = modeManager;
    this.n8n = n8nClient;
  }

  async run(commandText, context = {}) {
    const mode = context.mode || this.modeManager.getDefaultMode();
    const task = this.taskRouter.resolveTaskFromMessage(commandText);
    const route = this.modeManager.getDefaultRoute(mode);
    const routeCheck = this.modeManager.validateRoute(mode, route);
    const modeCheck = this.modeManager.validateModeForTask(mode, {
      id: task.intent_id,
      allowed_modes: task.task_contract?.allowed_modes || task.allowed_modes || [],
    });

    if (!routeCheck.allowed || !modeCheck.allowed) {
      return {
        status: 'blocked',
        reason: modeCheck.reason || routeCheck.reason,
        mode,
        route,
        intent_id: task.intent_id,
      };
    }

    const payload = {
      user_message: commandText,
      mode,
      route_id: route,
      topic: commandText,
      context: context.topic_context || 'YouTube video',
      dossier_id: context.dossier_id,
    };

    const result = await this.n8n.trigger(task.entry_workflow, payload);
    return {
      status: result.status === 'failed' ? 'failed' : 'accepted',
      intent_id: task.intent_id,
      workflow_id: task.entry_workflow,
      route_id: route,
      mode,
      n8n_result: result,
    };
  }
}

module.exports = OllamaToolRunner;

async function runCli() {
  const argMessage = process.argv.slice(2).join(' ').trim();
  const askMessage = () => new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('Enter command for Shadow Operator: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });

  const message = argMessage || await askMessage();
  if (!message) {
    console.error('[ERROR] No command provided.');
    process.exit(1);
  }

  try {
    const response = await axios.post('http://localhost:5050/operator/new-content-job', {
      topic: message,
      context: 'YouTube video',
      mode: 'creator',
      route_id: 'ROUTE_PHASE1_STANDARD',
    }, { timeout: 45000 });

    console.log(JSON.stringify(response.data, null, 2));
  } catch (err) {
    const details = err.response?.data || { message: err.message };
    console.error(JSON.stringify({
      status: 'failed',
      error: err.message,
      details,
    }, null, 2));
    process.exit(1);
  }
}

if (require.main === module) {
  runCli();
}
