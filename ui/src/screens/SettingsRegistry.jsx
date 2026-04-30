import { useState } from 'react';
import ScreenGate from '../components/ScreenGate';

function SettingsRegistryContent() {
  const [activeTab, setActiveTab] = useState('system');

  const tabs = [
    { id: 'system', label: 'System Settings', icon: '⚙️' },
    { id: 'registries', label: 'Registries', icon: '📋' },
    { id: 'governance', label: 'Governance', icon: '⚖️' },
    { id: 'prompts', label: 'System Prompts', icon: '📝' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">⚙️ Settings & Registries</h1>
      <p className="text-gray-400 text-sm">View and manage system configuration</p>

      <div className="flex gap-2 border-b border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-semibold transition flex items-center gap-2 ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'system' && (
        <div className="space-y-4">
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">🔧 System Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">N8N Webhook URL</label>
                <input
                  type="text"
                  value="http://localhost:5678"
                  readOnly
                  className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">API Timeout (ms)</label>
                <input
                  type="number"
                  value="30000"
                  className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Data Refresh Interval (s)</label>
                <input
                  type="number"
                  value="5"
                  className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm"
                />
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'registries' && (
        <div className="space-y-4">
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">📋 Mode Registry</h2>
            <div className="space-y-3">
              {['founder', 'creator', 'builder', 'operator'].map(mode => (
                <div key={mode} className="bg-gray-800 p-3 rounded border border-gray-600 flex justify-between items-center">
                  <span className="font-semibold capitalize">{mode}</span>
                  <button className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition">
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">📊 Workflow Registry</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {['WF-001', 'WF-100', 'WF-200', 'WF-300', 'WF-400', 'WF-500', 'WF-600', 'WF-900'].map(wf => (
                <div key={wf} className="bg-gray-800 p-2 rounded border border-gray-600 flex justify-between items-center text-sm">
                  <span className="font-semibold">{wf}</span>
                  <button className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'governance' && (
        <div className="space-y-4">
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">⚖️ Governance Gates</h2>
            <div className="space-y-3">
              {[
                { name: 'Approval Gate', status: 'active', role: 'founder' },
                { name: 'Quality Threshold', status: 'active', role: 'creator' },
                { name: 'Resource Limit', status: 'active', role: 'founder' },
                { name: 'Compliance Check', status: 'active', role: 'founder' },
              ].map((gate, idx) => (
                <div key={idx} className="bg-gray-800 p-3 rounded border border-gray-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{gate.name}</div>
                      <div className="text-xs text-gray-500">Required role: {gate.role}</div>
                    </div>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-green-900 text-green-300">
                      {gate.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">📋 Role Permissions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-600">
                  <tr>
                    <th className="text-left py-2 px-2">Role</th>
                    <th className="text-center py-2 px-2">Create</th>
                    <th className="text-center py-2 px-2">Approve</th>
                    <th className="text-center py-2 px-2">Modify</th>
                    <th className="text-center py-2 px-2">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {['founder', 'creator', 'builder', 'operator'].map(role => (
                    <tr key={role} className="hover:bg-gray-800 transition">
                      <td className="py-2 px-2 font-semibold capitalize">{role}</td>
                      <td className="text-center py-2 px-2">✓</td>
                      <td className="text-center py-2 px-2">{role === 'founder' ? '✓' : '✗'}</td>
                      <td className="text-center py-2 px-2">{role !== 'operator' ? '✓' : '✗'}</td>
                      <td className="text-center py-2 px-2">{role === 'founder' ? '✓' : '✗'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'prompts' && (
        <div className="space-y-4">
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">📝 System Prompts</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Topic Intelligence Prompt</label>
                <textarea
                  rows="4"
                  className="w-full bg-gray-800 border border-gray-600 rounded p-3 text-sm"
                  defaultValue="Analyze the given topic and extract key intelligence signals..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Script Generation Prompt</label>
                <textarea
                  rows="4"
                  className="w-full bg-gray-800 border border-gray-600 rounded p-3 text-sm"
                  defaultValue="Generate a compelling script based on the intelligence and tone..."
                />
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition">
                Save Prompts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsRegistry() {
  return (
    <ScreenGate screenId="SCR-020" fallback="Settings & Registries">
      <SettingsRegistryContent />
    </ScreenGate>
  );
}
