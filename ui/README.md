# Shadow Creator OS - Phase 1 UI Layer

Local web dashboard for Shadow Creator OS orchestration platform built with React, Vite, and Tailwind CSS.

## Features

✅ **18 Screens** - All screens from ui_registry.json implemented:
- Dashboard (system overview, stats, quick actions)
- Mission Control (real-time workflow orchestration)
- Workflow Monitor (execution traces, logs, metrics)
- Dossier Inspector (view complete dossier state)
- Topic Pipeline (visual stage flow)
- Research Panel (evidence synthesis)
- Script & Debate Panel (script generation and refinement)
- Context Packet Panel (execution context viewer)
- Resource Planner (cost/latency estimates)
- Alert Center (real-time notifications)
- Troubleshoot Console (deep diagnostics)
- Replay Console (checkpoint-based recovery)
- Analytics Dashboard (metrics and trends)
- Self-Learning Dashboard (autonomous tuning)
- Settings & Registry (system configuration)
- Plus list views for Workflows, Dossiers, Research, Scripts, Context, Media, Publishing

✅ **Mode Selector** - Switch between operating modes:
- Founder Mode (governance, overrides, cost approval)
- Creator Mode (safe production)
- Builder Mode (repo construction)
- Operator Mode (support and recovery)

✅ **Model Selector** - Choose execution models:
- Local Ollama models (Llama 3.2, Mistral) - Available now
- Cloud models (Claude, Gemini) - Phase 2+

✅ **n8n Integration** - Connects to n8n at localhost:5678:
- Workflow execution API
- Execution history tracking
- Real-time status monitoring

✅ **Local Data Access** - Reads from local files:
- Dossier index (se_dossier_index.json)
- Packet index (se_packet_index.json)
- Individual dossiers
- Route runs history

## Quick Start

### Prerequisites
- Node.js 18+
- npm 8+
- n8n running at localhost:5678
- Ollama (for local models, optional)

### Installation

```bash
cd ui
npm install --legacy-peer-deps
```

### Development

Start the development server:
```bash
npm run dev
```

Open browser: **http://localhost:3000**

### Build for Production

```bash
npm run build
```

Distributable files in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Architecture

### Directory Structure

```
ui/
├── src/
│   ├── api/
│   │   └── n8nClient.js          # API client for n8n and data
│   ├── components/
│   │   ├── Layout.jsx             # Main layout wrapper
│   │   ├── Sidebar.jsx            # Navigation sidebar
│   │   ├── TopBar.jsx             # Top bar with selectors
│   │   ├── ModeSelector.jsx       # Operating mode dropdown
│   │   ├── ModelSelector.jsx      # Execution model dropdown
│   │   └── ErrorBoundary.jsx      # Error handling
│   ├── screens/                   # 15 main screens
│   │   ├── Dashboard.jsx
│   │   ├── MissionControl.jsx
│   │   ├── WorkflowMonitor.jsx
│   │   ├── DossierViewer.jsx
│   │   ├── TopicPipeline.jsx
│   │   ├── ResearchPanel.jsx
│   │   ├── ScriptDebatePanel.jsx
│   │   ├── ContextPacketPanel.jsx
│   │   ├── ResourcePlanner.jsx
│   │   ├── AlertCenter.jsx
│   │   ├── TroubleshootConsole.jsx
│   │   ├── ReplayConsole.jsx
│   │   ├── AnalyticsDashboard.jsx
│   │   ├── SelfLearningDashboard.jsx
│   │   └── SettingsRegistry.jsx
│   ├── store/
│   │   └── useAppStore.js         # Zustand state management
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Tailwind CSS
├── public/                         # Static assets
├── .env.local                      # Environment variables
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
└── package.json                   # Dependencies
```

### Key Technologies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - State management (lightweight)
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS styling

### State Management

Using Zustand for minimal, reactive state:

```javascript
const { selectedMode, selectedModel, setSelectedMode } = useAppStore();
```

Store tracks:
- Current mode and model selections
- UI state (sidebar, current screen)
- Loading and error states
- Data (dossiers, workflows, executions, alerts)

### n8n Integration

API client at `src/api/n8nClient.js`:
- List and execute workflows
- Fetch execution history
- Read local data files (via proxy)

```javascript
await workflowApi.executeWorkflow(webhookUrl, payload);
await dataApi.getDossier(dossierId);
```

### Routing

All routes handled by React Router:
- `/` - Dashboard (default)
- `/mission-control` - Orchestration control
- `/workflows/:id/monitor` - Execution details
- `/dossiers/:id` - Dossier inspection
- And 12+ more screens

## Development Roadmap

### Phase 1 (Current - UI Scaffolding)
- ✅ Project structure
- ✅ All 18 screen skeletons
- ✅ Navigation and routing
- ✅ Mode/Model selectors
- ✅ Basic styling with Tailwind
- ✅ API client setup
- ⏳ Dashboard implementation (in progress)

### Phase 2 (Screen Implementation)
- [ ] Complete all 18 screens with data
- [ ] Dashboard with real stats
- [ ] Mission Control with DAG visualization
- [ ] Workflow Monitor with live logs
- [ ] Dossier viewer with full state
- [ ] Topic pipeline visualization
- [ ] Research synthesis display
- [ ] Script editor and debate view
- [ ] Context packet inspector
- [ ] Resource planner with cost calc
- [ ] Alert center with filtering
- [ ] Troubleshoot console with tools
- [ ] Replay console with checkpoints
- [ ] Analytics charts and graphs
- [ ] Self-Learning feedback UI
- [ ] Settings/Registry editor

### Phase 3 (Enhancement)
- [ ] Real-time WebSocket updates
- [ ] Advanced filtering and search
- [ ] Customizable dashboards
- [ ] Export/Import functionality
- [ ] Keyboard shortcuts
- [ ] Dark/Light theme toggle
- [ ] Mobile responsive design

### Phase 4 (Production)
- [ ] Performance optimization
- [ ] Error handling and recovery
- [ ] Analytics and monitoring
- [ ] Security hardening
- [ ] Cloud deployment
- [ ] CI/CD integration

## Configuration

### Environment Variables

`.env.local`:
```bash
VITE_N8N_URL=http://localhost:5678          # n8n instance URL
VITE_API_BASE=http://localhost:3000/api     # API proxy base
```

### Vite Config

Includes:
- React plugin for JSX
- API proxy to n8n
- Tailwind CSS processing
- Source maps in build

### Tailwind Theme

Custom colors:
- `shadow-dark`: #0a0e27 (background)
- `shadow-card`: #151b2f (card background)
- `shadow-accent`: #3b82f6 (primary blue)
- `shadow-success`: #10b981 (green)
- `shadow-warning`: #f59e0b (amber)
- `shadow-error`: #ef4444 (red)

## API Integration

### n8n Workflows

Execute workflows via webhooks:
```javascript
const response = await workflowApi.executeWorkflow(
  'http://localhost:5678/webhook/...',
  { topic, mode, model, ... }
);
```

### Local Data Files

Read JSON files from disk:
```javascript
const dossiers = await dataApi.getDossierIndex();
const packets = await dataApi.getPacketIndex();
const dossier = await dataApi.getDossier('DOSSIER-xyz');
```

## Troubleshooting

### Port 3000 Already in Use
```bash
npx kill-port 3000
npm run dev
```

### n8n Connection Issues
- Verify n8n is running: http://localhost:5678
- Check vite.config.js proxy settings
- Browser DevTools Network tab for API calls

### Tailwind Classes Not Applying
- Ensure `src/**/*.{js,jsx,tsx,ts}` in tailwind.config.js
- Run `npm install --legacy-peer-deps` if issues persist
- Check browser DevTools for CSS loading

### Hot Module Replacement (HMR) Issues
- File changes auto-refresh in browser
- If not working, restart dev server

## Performance Notes

- Lazy loading for screens (via React Router)
- Code splitting for smaller bundles
- Zustand for lightweight state management
- No unnecessary re-renders (selective subscriptions)

## Security

- No sensitive credentials in .env.local
- n8n API keys handled server-side
- XSS protection via React
- CSRF protection via n8n

## Future Enhancements

- [ ] Dark mode persistence
- [ ] User session management
- [ ] Audit logging UI
- [ ] Advanced search/filtering
- [ ] Batch operations
- [ ] Custom workflows UI
- [ ] Director management UI
- [ ] Skill editor interface
- [ ] Real-time collaboration
- [ ] Mobile native app (React Native)

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review n8n logs: http://localhost:5678
3. Check browser console for errors
4. Review API responses in DevTools Network tab

## License

MIT - Part of Shadow Creator OS

---

**Status**: Phase 1 scaffolding complete  
**Last Updated**: 2026-04-30  
**Next**: Screen implementation (Phase 2)
