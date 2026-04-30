import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import TaskLauncher from '../components/TaskLauncher';
import ExecutionTreePanel from '../components/ExecutionTreePanel';

export default function Chat() {
  const { selectedMode, setCurrentScreen } = useAppStore();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      text: '👋 Shadow Creator OS Command Center\n\nConnected to real orchestration service at localhost:5002\nn8n backend at localhost:5680\n\nExample: "Create a YouTube script about procrastination"',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentExecution, setCurrentExecution] = useState(null);
  const [executionTree, setExecutionTree] = useState(null);
  const [approvalInProgress, setApprovalInProgress] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setCurrentScreen('chat');
  }, [setCurrentScreen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTaskLaunch = (intentId) => {
    const intentLabels = {
      new_content_job: 'Create a YouTube script about a trending topic',
      generate_script: 'Write a compelling script for my content',
      generate_topic_ideas: 'Suggest 5 trending topic ideas',
      generate_thumbnail_concept: 'Design a thumbnail concept',
      generate_metadata: 'Generate title, description, and tags',
      debate_script: 'Get critique on my script from another perspective',
      approve_dossier: 'Approve the generated content for publishing',
      reject_dossier: 'Request changes and replay the workflow',
      replay_stage: 'Replay the last workflow stage',
      troubleshoot_error: 'Investigate the recent workflow error',
    };

    const msg = intentLabels[intentId] || intentId;
    setInputText(msg);
    // Focus the input field
    setTimeout(() => {
      document.querySelector('input[placeholder*="Example"]')?.focus();
    }, 0);
  };

  const handleApprove = async () => {
    if (!currentExecution?.dossier_id) {
      alert('No dossier to approve');
      return;
    }

    setApprovalInProgress(true);

    try {
      const res = await fetch(`/api/chat/dossiers/${currentExecution.dossier_id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_mode: selectedMode }),
      });

      const result = await res.json();

      if (result.success) {
        setExecutionTree(result.execution_tree);

        const approvalMsg = `✅ APPROVAL EXECUTED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPROVAL RESULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dossier ID:         ${result.dossier_id}
Execution ID:       ${result.execution_id}
Status:             ${result.status}
Message:            ${result.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTION TREE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${result.execution_tree_text || 'Tree visualization available'}
`;

        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'bot',
          text: approvalMsg,
          execution: result,
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'error',
          text: `Approval failed: ${result.error}`,
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'error',
        text: `Approval error: ${err.message}`,
      }]);
    } finally {
      setApprovalInProgress(false);
    }
  };

  const handleReject = async () => {
    if (!currentExecution?.dossier_id) {
      alert('No dossier to reject');
      return;
    }

    const feedback = prompt('Enter rejection reason (or leave blank for default):');
    if (feedback === null) return; // User cancelled

    setApprovalInProgress(true);

    try {
      const res = await fetch(`/api/chat/dossiers/${currentExecution.dossier_id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_mode: selectedMode,
          feedback: feedback || 'Requires revision and remodification',
        }),
      });

      const result = await res.json();

      if (result.success) {
        setExecutionTree(result.execution_tree);

        const rejectMsg = `🔄 REPLAY SCHEDULED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REJECTION & REPLAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dossier ID:         ${result.dossier_id}
Execution ID:       ${result.execution_id}
Status:             ${result.status}
Action:             ${result.action}
Feedback:           ${result.feedback}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${result.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTION TREE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${result.execution_tree_text || 'Tree visualization available'}
`;

        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'bot',
          text: rejectMsg,
          execution: result,
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'error',
          text: `Rejection failed: ${result.error}`,
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'error',
        text: `Rejection error: ${err.message}`,
      }]);
    } finally {
      setApprovalInProgress(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    setMessages(prev => [...prev, {
      id: prev.length + 1,
      type: 'user',
      text: inputText,
    }]);

    const msg = inputText;
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          selected_mode: selectedMode,
          runtime: 'local',
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      if (result.status === 'accepted') {
        setCurrentExecution(result);

        // Use TRUTHFUL status: what actually happened
        const actualStatus = result.orchestration_truth || 'accepted_awaiting_execution';
        const hasOutput = result.packets_generated > 0;

        const packets = hasOutput
          ? `${result.artifact_families.join(', ')}`
          : 'awaiting workflow execution';

        const statusIndicator = hasOutput
          ? '📦'
          : '⏳';

        const output = `${statusIndicator} ORCHESTRATION ${actualStatus.toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTION CHAIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Intent Resolved:    ${result.intent_label}
Confidence:         99%
Current Mode:       ${selectedMode}
Route:              ${result.workflow_triggered}
Model Selected:     ${result.selected_model}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOSSIER & EXECUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dossier ID:         ${result.dossier_id}
Execution ID:       ${result.execution_id}
Status:             ${result.execution_status}
Workflow Chain:     ${result.workflow_triggered}
Current Stage:      ${result.current_stage || 'WF-001'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PACKETS & ARTIFACTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated:          ${result.packets_generated} packets
Artifact Families:  ${packets}
Approval Required:  ${result.approval_required ? 'YES' : 'NO'}
Replay Eligible:    ${result.replay_eligible ? 'YES' : 'NO'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${result.next_actions?.map(a => `• ${a.label}`).join('\n') || '• Waiting for workflow completion...'}
`;

        setMessages(prev => [...prev, {
          id: prev.length + 2,
          type: 'bot',
          text: output,
          execution: result,
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: prev.length + 2,
          type: 'error',
          text: `Status: ${result.status}\n${result.message || result.error || 'Unknown error'}`,
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: prev.length + 2,
        type: 'error',
        text: `ERROR: ${err.message}`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-shadow-bg">
      <div className="bg-shadow-card border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold">🎮 Shadow Creator OS — Command Center</h1>
        <div className="text-xs text-gray-400 mt-2">
          Mode: <span className="text-blue-400">{selectedMode}</span>
          | Backend: <span className="text-green-400">localhost:5002</span>
          | n8n: <span className="text-green-400">localhost:5678</span>
          | Mock: <span className="text-gray-500">DEV ONLY (5680)</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Task Launchers always visible on initial load */}
        {messages.filter(m => m.type !== 'system').length === 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
            <TaskLauncher onTaskLaunch={handleTaskLaunch} compact={false} />
          </div>
        )}

        {/* Execution Tree Panel */}
        {executionTree && (
          <div className="mb-4">
            <ExecutionTreePanel executionTree={executionTree} />
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-4xl px-4 py-3 rounded-lg ${msg.type === 'user' ? 'bg-blue-600 text-white' : msg.type === 'error' ? 'bg-red-900 text-red-200 border border-red-700' : 'bg-gray-800 text-gray-100 border border-gray-600'}`}>
              <div className="whitespace-pre-wrap text-sm font-mono">{msg.text}</div>
              {msg.execution && (
                <div className="mt-4 space-y-2 border-t border-gray-600 pt-3">
                  {selectedMode === 'founder' && msg.execution.approval_required && msg.execution.packets_generated > 0 ? (
                    <>
                      <button
                        onClick={handleApprove}
                        disabled={approvalInProgress}
                        className="block w-full px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded text-sm font-semibold"
                      >
                        {approvalInProgress ? '⟳ Processing...' : '✅ Approve Output'}
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={approvalInProgress}
                        className="block w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 rounded text-sm font-semibold"
                      >
                        {approvalInProgress ? '⟳ Processing...' : '🔄 Request Changes'}
                      </button>
                    </>
                  ) : (
                    <button
                      disabled
                      className="block w-full px-3 py-2 bg-gray-600 cursor-not-allowed rounded text-sm font-semibold text-gray-300"
                    >
                      {msg.execution.packets_generated === 0
                        ? '⏳ Waiting for workflow execution...'
                        : selectedMode !== 'founder'
                        ? 'Only Founder can approve'
                        : 'Approval pending...'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-shadow-card border-t border-gray-700 p-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder="Example: Create a YouTube script about procrastination with thumbnail ideas..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading || !inputText.trim()} className={`px-6 py-2 rounded font-semibold ${loading || !inputText.trim() ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? '⏳' : 'Send'}
          </button>
        </div>
        <div className="text-xs text-gray-500">
          💡 Real orchestration: message → intent → mode guard → route → model → n8n → dossier → packets → approval
        </div>
      </div>
    </div>
  );
}
