const express = require('express');
const ChatOrchestrationService = require('../chat/chat_orchestration_service');
const ChatSessionStore = require('../chat/chat_session_store');
const GuiTaskRouter = require('../gui/gui_task_router');

function createChatRouter() {
  const router = express.Router();
  const orchestration = new ChatOrchestrationService();
  const sessions = new ChatSessionStore();
  const taskRouter = new GuiTaskRouter();

  router.post('/message', async (req, res) => {
    try {
      const { message, selected_mode = 'creator', runtime = 'local', session_id = null } = req.body || {};
      if (!message || !String(message).trim()) {
        return res.status(400).json({ status: 'invalid_request', error: 'message is required' });
      }

      const session = session_id ? sessions.getSession(session_id) : sessions.createSession({ selected_mode, runtime_mode: runtime });
      if (!session) {
        return res.status(404).json({ status: 'not_found', error: 'chat session not found' });
      }

      sessions.upsertMessage(session.chat_session_id, { role: 'user', content: message });
      const result = await orchestration.processMessage(message, selected_mode, null, { selectedRuntime: runtime });
      let executionTree = null;
      if (result.intent_id) {
        const routed = await taskRouter.routeGuiAction(result.intent_id, selected_mode, { dossier_id: result.dossier_id });
        executionTree = routed?.execution_tree || null;
      }
      sessions.upsertMessage(session.chat_session_id, {
        role: 'assistant',
        content: JSON.stringify(result),
        run_id: result.run_id,
        workflow_id: result.workflow_triggered || result.workflow_id || null,
        status: result.status,
        dossier_id: result.dossier_id || null,
      });

      const response = {
        ...result,
        chat_session_id: session.chat_session_id,
        execution_tree: executionTree,
      };
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ status: 'error', error: error.message });
    }
  });

  router.get('/runs/:run_id', async (req, res) => {
    const data = await orchestration.getExecutionResults(req.params.run_id);
    if (data.status === 'not_found') return res.status(404).json(data);
    return res.json(data);
  });

  router.get('/sessions', (req, res) => {
    return res.json({ sessions: sessions.listSessions() });
  });

  router.post('/sessions', (req, res) => {
    const created = sessions.createSession(req.body || {});
    return res.status(201).json(created);
  });

  router.get('/sessions/:id', (req, res) => {
    const s = sessions.getSession(req.params.id);
    if (!s) return res.status(404).json({ status: 'not_found' });
    return res.json(s);
  });

  router.post('/sessions/:id/messages', (req, res) => {
    const msg = sessions.upsertMessage(req.params.id, req.body || {});
    if (!msg) return res.status(404).json({ status: 'not_found' });
    return res.status(201).json(msg);
  });

  router.patch('/sessions/:id', (req, res) => {
    const updated = sessions.updateSession(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ status: 'not_found' });
    return res.json(updated);
  });

  router.post('/dossiers/:dossier_id/approve', async (req, res) => {
    const mode = req.body?.user_mode || 'creator';
    const result = await orchestration.approveDossier(req.params.dossier_id, mode);
    const tree = taskRouter.routeGuiAction ? await taskRouter.routeGuiAction('approve_output', mode, { dossier_id: req.params.dossier_id }) : null;
    return res.json({
      success: result.status === 'success',
      ...result,
      execution_tree: tree?.execution_tree || null,
      execution_tree_text: tree?.tree_text || null,
      message: result.status === 'success' ? 'Approval request accepted.' : (result.error || result.reason || 'Approval failed'),
    });
  });

  router.post('/dossiers/:dossier_id/reject', async (req, res) => {
    const mode = req.body?.user_mode || 'creator';
    const feedback = req.body?.feedback || 'Requires revisions';
    const result = await orchestration.rejectDossier(req.params.dossier_id, feedback, mode);
    const tree = taskRouter.routeGuiAction ? await taskRouter.routeGuiAction('reject_and_remodify', mode, { dossier_id: req.params.dossier_id }) : null;
    return res.json({
      success: result.status === 'success',
      ...result,
      feedback,
      action: 'REPLAY_REQUESTED',
      execution_tree: tree?.execution_tree || null,
      execution_tree_text: tree?.tree_text || null,
      message: result.status === 'success' ? 'Replay/remodify request accepted.' : (result.error || result.reason || 'Reject failed'),
    });
  });

  return router;
}

module.exports = createChatRouter;
