import React from 'react';

export default function TaskLauncher({ onTaskLaunch, compact = false }) {
  const tasks = [
    { id: 'new_content_job', label: '📝 Create New Content Job' },
    { id: 'generate_topic_ideas', label: '💡 Generate Topic Ideas' },
    { id: 'generate_thumbnail_concept', label: '🎨 Generate Thumbnail' },
    { id: 'generate_metadata', label: '🏷️ Generate Metadata' },
    { id: 'debate_script', label: '⚔️ Debate Script Quality' },
  ];

  return (
    <div className={`grid ${compact ? 'grid-cols-2 gap-2' : 'grid-cols-1 gap-3'}`}>
      <h3 className={`${compact ? 'col-span-2' : ''} text-sm font-semibold text-gray-300 mb-2`}>
        Quick Actions
      </h3>
      {tasks.map(task => (
        <button
          key={task.id}
          onClick={() => onTaskLaunch(task.id)}
          className="px-3 py-2 bg-blue-700 hover:bg-blue-600 rounded text-left text-sm font-medium text-white transition"
        >
          {task.label}
        </button>
      ))}
    </div>
  );
}
