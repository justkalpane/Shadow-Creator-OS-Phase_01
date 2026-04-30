const fs = require('fs');
const path = require('path');

class ChatSessionStore {
  constructor() {
    this.filePath = path.join(__dirname, '../../data/se_chat_history.json');
    this.ensureStore();
  }

  ensureStore() {
    if (!fs.existsSync(path.dirname(this.filePath))) {
      fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({ sessions: [], last_updated: new Date().toISOString() }, null, 2), 'utf8');
    }
  }

  readStore() {
    this.ensureStore();
    try {
      const parsed = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      if (!Array.isArray(parsed.sessions)) parsed.sessions = [];
      return parsed;
    } catch {
      return { sessions: [], last_updated: new Date().toISOString() };
    }
  }

  writeStore(store) {
    const data = { ...store, last_updated: new Date().toISOString() };
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  listSessions() {
    return this.readStore().sessions.sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')));
  }

  createSession(input = {}) {
    const store = this.readStore();
    const now = new Date().toISOString();
    const id = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const session = {
      chat_session_id: id,
      title: input.title || 'New Session',
      created_at: now,
      updated_at: now,
      selected_mode: input.selected_mode || 'creator',
      runtime_mode: input.runtime_mode || 'local',
      selected_model: input.selected_model || 'ollama_local_llama3.2',
      dossier_id: input.dossier_id || null,
      messages: [],
      linked_packets: [],
      linked_dossiers: [],
      error_refs: [],
      approval_refs: [],
    };
    store.sessions.push(session);
    this.writeStore(store);
    return session;
  }

  getSession(id) {
    return this.listSessions().find((s) => s.chat_session_id === id) || null;
  }

  upsertMessage(sessionId, message) {
    const store = this.readStore();
    const idx = store.sessions.findIndex((s) => s.chat_session_id === sessionId);
    if (idx < 0) return null;
    const now = new Date().toISOString();
    const msg = {
      role: message.role || 'assistant',
      content: message.content || '',
      timestamp: now,
      run_id: message.run_id || null,
      workflow_id: message.workflow_id || null,
      status: message.status || null,
    };
    store.sessions[idx].messages.push(msg);
    store.sessions[idx].updated_at = now;
    if (message.dossier_id) {
      store.sessions[idx].dossier_id = message.dossier_id;
      if (!store.sessions[idx].linked_dossiers.includes(message.dossier_id)) {
        store.sessions[idx].linked_dossiers.push(message.dossier_id);
      }
    }
    this.writeStore(store);
    return msg;
  }

  updateSession(id, patch = {}) {
    const store = this.readStore();
    const idx = store.sessions.findIndex((s) => s.chat_session_id === id);
    if (idx < 0) return null;
    store.sessions[idx] = { ...store.sessions[idx], ...patch, updated_at: new Date().toISOString() };
    this.writeStore(store);
    return store.sessions[idx];
  }
}

module.exports = ChatSessionStore;
