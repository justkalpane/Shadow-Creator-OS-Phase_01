/**
 * Shadow Operator MCP bridge scaffold.
 * This exposes the operator-core functions for MCP clients.
 * Phase-1 note: keep this module as a callable adapter target.
 */

const ModeManager = require('../mode_manager');
const OperatorN8nClient = require('../n8n_client');
const OutputReader = require('../output_reader');
const ReviewManager = require('../review_manager');
const TaskRouter = require('../task_router');

function createShadowOperatorMcpFacade() {
  const modes = new ModeManager();
  const n8n = new OperatorN8nClient();
  const outputs = new OutputReader();
  const review = new ReviewManager(n8n);
  const router = new TaskRouter();

  return {
    async create_content_job(args = {}) {
      const task = router.resolveTaskFromMessage(args.topic || args.message || 'new content job');
      return n8n.trigger(task.entry_workflow || 'WF-010', {
        topic: args.topic || args.message || '',
        context: args.context || 'YouTube video',
        mode: args.mode || 'creator',
        route_id: args.route_id || modes.getDefaultRoute(args.mode || 'creator'),
      });
    },
    inspect_dossier(args = {}) {
      return outputs.getDossier(args.dossier_id);
    },
    list_outputs(args = {}) {
      return outputs.getDossierOutputs(args.dossier_id);
    },
    approve_output(args = {}) {
      return review.approveOutput(args.dossier_id, args.reviewer || 'founder');
    },
    replay_stage(args = {}) {
      return review.replayStage(args.dossier_id, args.stage, args.checkpoint, args.remodify_instructions);
    },
  };
}

module.exports = { createShadowOperatorMcpFacade };

