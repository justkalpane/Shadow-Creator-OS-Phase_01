import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import TaskLauncher from '../components/TaskLauncher';
import ExecutionTreePanel from '../components/ExecutionTreePanel';

function parseAssistantMessage(content) {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export default function Chat() {
  const { selectedMode, setCurrentScreen } = useAppStore();
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentExecution, setCurrentExecution] = useState(null);
  const [executionTree, setExecutionTree] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => setCurrentScreen('chat'), [setCurrentScreen]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const res = await fetch('/api/chat/sessions');
      const data = await res.json();
      const list = Array.isArray(data.sessions) ? data.sessions : [];
      setSessions(list);
      if (!activeSessionId && list.length > 0) {
        openSession(list[0].chat_session_id);
      }
    } catch {
      setSessions([]);
    }
  }

  async function openSession(sessionId) {
    const res = await fetch(`/api/chat/sessions/${sessionId}`);
    if (!res.ok) return;
    const session = await res.json();
    setActiveSessionId(sessionId);
    const mapped = (session.messages || []).map((m, i) => ({
      id: `${sessionId}-${i}`,
      type: m.role === 'user' ? 'user' : (m.status === 'workflow_trigger_failed' ? 'error' : 'bot'),
      text: m.role === 'assistant' ? (parseAssistantMessage(m.content)?.message || m.content) : m.content,
      raw: m,
    }));
    setMessages(mapped);
  }

  async function createSession() {
    const res = await fetch('/api/chat/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selected_mode: selectedMode, title: 'New Session' }),
    });
    const created = await res.json();
    await loadSessions();
    await openSession(created.chat_session_id);
  }

  const providerBoundaryText = useMemo(
    () => 'Planning packet generated. Actual provider execution is not enabled yet.',
    [],
  );

  const handleTaskLaunch = (intentId) => {
    const map = {
      new_content_job: 'Create a YouTube script about procrastination and thumbnail ideas.',
      generate_topic_ideas: 'Generate 5 topic ideas for my channel.',
      generate_script: 'Generate a script for my current topic.',
      debate_script: 'Debate and critique this script.',
      generate_thumbnail_concept: 'Generate thumbnail concepts.',
      generate_metadata: 'Generate title, description, and tags.',
      troubleshoot_error: 'Troubleshoot the last workflow error.',
    };
    setInputText(map[intentId] || intentId);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    if (!activeSessionId) await createSession();

    const text = inputText.trim();
    setInputText('');
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, type: 'user', text }]);
    setLoading(true);
    setErrorDetails(null);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          selected_mode: selectedMode,
          runtime: 'local',
          session_id: activeSessionId,
        }),
      });
      const result = await res.json();

      if (result.chat_session_id && result.chat_session_id !== activeSessionId) {
        setActiveSessionId(result.chat_session_id);
      }
      setExecutionTree(result.execution_tree || null);
      setCurrentExecution(result);

      if (result.status === 'workflow_trigger_failed') {
        setErrorDetails({
          workflow_id: result.workflow_id,
          requested_url: result.requested_url,
          method: result.method,
          http_status: result.http_status,
          response_body: result.response_body,
          error_message: result.error_message,
          likely_fix: result.likely_fix,
        });
        setMessages((prev) => [...prev, {
          id: `e-${Date.now()}`,
          type: 'error',
          text: `Status: workflow_trigger_failed\nWorkflow: ${result.workflow_id || '-'}\nError: ${result.error_message || 'Unknown error'}`,
        }]);
      } else {
        const out = [
          `Status: ${result.status}`,
          `Truth: ${result.orchestration_truth || '-'}`,
          `Intent: ${result.intent_label || result.intent_id || '-'}`,
          `Dossier: ${result.dossier_id || '-'}`,
          `Workflow: ${result.workflow_triggered || '-'}`,
          `Execution: ${result.execution_id || '-'}`,
          `Packets Generated: ${result.packets_generated ?? 0}`,
          `Artifacts: ${(result.artifact_families || []).join(', ') || 'none yet'}`,
        ].join('\n');

        setMessages((prev) => [...prev, { id: `b-${Date.now()}`, type: 'bot', text: out, execution: result }]);
      }
      await loadSessions();
    } catch (err) {
      setMessages((prev) => [...prev, { id: `x-${Date.now()}`, type: 'error', text: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-shadow-bg">
      <aside className="w-72 border-r border-gray-700 bg-gray-900/40 p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Chat History</h2>
          <button onClick={createSession} className="px-2 py-1 text-xs bg-blue-600 rounded">New</button>
        </div>
        <div className="space-y-2 max-h-[80vh] overflow-y-auto">
          {sessions.map((s) => (
            <button
              key={s.chat_session_id}
              onClick={() => openSession(s.chat_session_id)}
              className={`w-full text-left p-2 rounded border ${activeSessionId === s.chat_session_id ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 bg-gray-800/40'}`}
            >
              <div className="text-xs font-semibold">{s.title || s.chat_session_id}</div>
              <div className="text-[11px] text-gray-400">{s.dossier_id || 'No dossier yet'}</div>
            </button>
          ))}
          {sessions.length === 0 && <div className="text-xs text-gray-500">No sessions yet.</div>}
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-700 p-3 bg-shadow-card">
          <h1 className="text-xl font-bold">Shadow Creator OS Command Center</h1>
          <div className="text-xs text-gray-400 mt-1">
            Backend: <span className="text-green-400">localhost:5002</span> |
            n8n: <span className="text-green-400">localhost:5678</span> |
            Mock n8n: <span className="text-yellow-400">DEV ONLY</span>
          </div>
        </div>

        <div className="p-3 border-b border-gray-700 bg-gray-800/40">
          <TaskLauncher onTaskLaunch={handleTaskLaunch} compact />
        </div>

        {executionTree && (
          <div className="p-3 border-b border-gray-700">
            <ExecutionTreePanel executionTree={executionTree} />
          </div>
        )}

        {errorDetails && (
          <div className="m-3 p-3 border border-red-700 bg-red-900/20 rounded text-xs font-mono whitespace-pre-wrap">
            <div className="font-semibold text-red-300 mb-1">Workflow Trigger Failed</div>
            <div>workflow: {errorDetails.workflow_id || '-'}</div>
            <div>url: {errorDetails.requested_url || '-'}</div>
            <div>method: {errorDetails.method || '-'}</div>
            <div>http_status: {String(errorDetails.http_status || '-')}</div>
            <div>response: {typeof errorDetails.response_body === 'string' ? errorDetails.response_body : JSON.stringify(errorDetails.response_body || {}, null, 2)}</div>
            <div>fix: {errorDetails.likely_fix || '-'}</div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-4xl p-3 rounded border text-sm whitespace-pre-wrap ${
                msg.type === 'user'
                  ? 'bg-blue-700 border-blue-600'
                  : msg.type === 'error'
                    ? 'bg-red-900/40 border-red-700'
                    : 'bg-gray-800 border-gray-700'
              }`}>
                {msg.text}
                {msg.execution && (
                  <div className="mt-3 pt-2 border-t border-gray-700 text-xs">
                    {msg.execution.approval_ready ? 'Approval ready.' : 'Approval hidden until output packets exist.'}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-gray-700 bg-shadow-card">
          <div className="text-xs text-yellow-300 mb-2">{providerBoundaryText}</div>
          <div className="flex gap-2">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Create a YouTube script about why people procrastinate and give me thumbnail ideas."
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !inputText.trim()}
              className="px-4 py-2 rounded bg-blue-600 disabled:bg-gray-600"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
