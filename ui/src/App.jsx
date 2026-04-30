import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Screen components (18 total)
import Dashboard from './screens/Dashboard';
import Overview from './screens/Overview';
import Routes from './screens/Routes';
import Dossiers from './screens/Dossiers';
import Approvals from './screens/Approvals';
import Errors from './screens/Errors';
import MissionControl from './screens/MissionControl';
import WorkflowMonitor from './screens/WorkflowMonitor';
import DossierViewer from './screens/DossierViewer';
import TopicPipeline from './screens/TopicPipeline';
import ResearchPanel from './screens/ResearchPanel';
import ScriptDebatePanel from './screens/ScriptDebatePanel';
import ContextPacketPanel from './screens/ContextPacketPanel';
import ResourcePlanner from './screens/ResourcePlanner';
import AlertCenter from './screens/AlertCenter';
import TroubleshootConsole from './screens/TroubleshootConsole';
import ReplayConsole from './screens/ReplayConsole';
import AnalyticsDashboard from './screens/AnalyticsDashboard';
import SelfLearningDashboard from './screens/SelfLearningDashboard';
import SettingsRegistry from './screens/SettingsRegistry';

import './index.css';

// Placeholder components for list views
const PlaceholderScreen = ({ title, description }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">{title}</h1>
    <div className="bg-shadow-card p-8 rounded border border-gray-700 text-center text-gray-400">
      <p className="text-lg">{description}</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Primary Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Core Screens - Phase 2 */}
          <Route path="/overview" element={<Overview />} />
          <Route path="/routes" element={<Routes />} />
          <Route path="/dossiers" element={<Dossiers />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/errors" element={<Errors />} />

          {/* Existing/Advanced Screens */}
          <Route path="/mission-control" element={<MissionControl />} />
          <Route path="/workflows" element={<PlaceholderScreen title="Workflows" description="List and monitor all workflows" />} />
          <Route path="/workflows/:workflowId/monitor" element={<WorkflowMonitor />} />
          <Route path="/dossiers/:dossierId/inspector" element={<DossierViewer />} />
          <Route path="/pipelines/topic-intelligence" element={<TopicPipeline />} />
          <Route path="/research" element={<PlaceholderScreen title="Research" description="View research outputs and evidence" />} />
          <Route path="/research/:dossierId" element={<ResearchPanel />} />
          <Route path="/script" element={<PlaceholderScreen title="Scripts" description="View generated scripts and drafts" />} />
          <Route path="/script/:dossierId" element={<ScriptDebatePanel />} />
          <Route path="/context" element={<PlaceholderScreen title="Context" description="View execution contexts and specifications" />} />
          <Route path="/context/:dossierId" element={<ContextPacketPanel />} />
          <Route path="/media" element={<PlaceholderScreen title="Media" description="View media assets and specifications" />} />
          <Route path="/publishing" element={<PlaceholderScreen title="Publishing" description="View publishing status and metadata" />} />
          <Route path="/planning/resources" element={<ResourcePlanner />} />
          <Route path="/alerts" element={<AlertCenter />} />
          <Route path="/troubleshoot" element={<TroubleshootConsole />} />
          <Route path="/replay/:dossierId" element={<ReplayConsole />} />
          <Route path="/analytics/:dossierId" element={<AnalyticsDashboard />} />
          <Route path="/learning" element={<SelfLearningDashboard />} />
          <Route path="/settings" element={<SettingsRegistry />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
