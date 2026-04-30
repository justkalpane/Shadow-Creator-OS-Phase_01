const ModeManager = require('./mode_manager');
const RouteManager = require('./route_manager');
const TaskRouter = require('./task_router');
const OperatorN8nClient = require('./n8n_client');
const OutputReader = require('./output_reader');
const ReviewManager = require('./review_manager');
const AlertManager = require('./alert_manager');
const TroubleshootManager = require('./troubleshoot_manager');
const EventStream = require('./event_stream');
const ProviderRouter = require('./provider_router');
const OllamaToolRunner = require('./ollama_tool_runner');

function createOperatorTools() {
  const modes = new ModeManager();
  const routes = new RouteManager();
  const taskRouter = new TaskRouter();
  const n8n = new OperatorN8nClient();
  const outputReader = new OutputReader();
  const review = new ReviewManager(n8n);
  const alerts = new AlertManager(n8n);
  const troubleshoot = new TroubleshootManager();
  const events = new EventStream();
  const providers = new ProviderRouter();
  const ollama = new OllamaToolRunner(modes, n8n);

  return {
    modes,
    routes,
    taskRouter,
    n8n,
    outputReader,
    review,
    alerts,
    troubleshoot,
    events,
    providers,
    ollama,
  };
}

module.exports = { createOperatorTools };

