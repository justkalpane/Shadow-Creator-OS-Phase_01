import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Lazy load screen components for better performance
const Dashboard = lazy(() => import('./screens/Dashboard'));
const Overview = lazy(() => import('./screens/Overview'));
const RoutesScreen = lazy(() => import('./screens/Routes'));
const Dossiers = lazy(() => import('./screens/Dossiers'));
const Approvals = lazy(() => import('./screens/Approvals'));
const Errors = lazy(() => import('./screens/Errors'));
const MissionControl = lazy(() => import('./screens/MissionControl'));
const FounderGovernance = lazy(() => import('./screens/FounderGovernance'));
const PhotoGenMode = lazy(() => import('./screens/PhotoGenMode'));
const ScriptGenMode = lazy(() => import('./screens/ScriptGenMode'));
const DebateMode = lazy(() => import('./screens/DebateMode'));
const VideoCreatorMode = lazy(() => import('./screens/VideoCreatorMode'));
const AvatarCreatorMode = lazy(() => import('./screens/AvatarCreatorMode'));
const MusicMode = lazy(() => import('./screens/MusicMode'));
const SongsMode = lazy(() => import('./screens/SongsMode'));
const PoetryMode = lazy(() => import('./screens/PoetryMode'));
const WorkflowMonitor = lazy(() => import('./screens/WorkflowMonitor'));
const DossierViewer = lazy(() => import('./screens/DossierViewer'));
const TopicPipeline = lazy(() => import('./screens/TopicPipeline'));
const ResearchPanel = lazy(() => import('./screens/ResearchPanel'));
const ScriptDebatePanel = lazy(() => import('./screens/ScriptDebatePanel'));
const ContextPacketPanel = lazy(() => import('./screens/ContextPacketPanel'));
const ResourcePlanner = lazy(() => import('./screens/ResourcePlanner'));
const AlertCenter = lazy(() => import('./screens/AlertCenter'));
const TroubleshootConsole = lazy(() => import('./screens/TroubleshootConsole'));
const ReplayConsole = lazy(() => import('./screens/ReplayConsole'));
const AnalyticsDashboard = lazy(() => import('./screens/AnalyticsDashboard'));
const SelfLearningDashboard = lazy(() => import('./screens/SelfLearningDashboard'));
const SettingsRegistry = lazy(() => import('./screens/SettingsRegistry'));

import './index.css';

// Loading component for Suspense fallback
const LoadingScreen = () => (
  <div className="space-y-6">
    <div className="h-8 w-48 bg-gray-700 rounded animate-pulse" />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-shadow-card p-4 rounded border border-gray-700 h-32 animate-pulse" />
      ))}
    </div>
    <div className="bg-shadow-card p-6 rounded border border-gray-700 h-64 animate-pulse" />
  </div>
);

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
          <Route path="/" element={<Suspense fallback={<LoadingScreen />}><Dashboard /></Suspense>} />
          <Route path="/dashboard" element={<Suspense fallback={<LoadingScreen />}><Dashboard /></Suspense>} />

          {/* Core Screens - Phase 2 */}
          <Route path="/overview" element={<Suspense fallback={<LoadingScreen />}><Overview /></Suspense>} />
          <Route path="/routes" element={<Suspense fallback={<LoadingScreen />}><RoutesScreen /></Suspense>} />
          <Route path="/dossiers" element={<Suspense fallback={<LoadingScreen />}><Dossiers /></Suspense>} />
          <Route path="/approvals" element={<Suspense fallback={<LoadingScreen />}><Approvals /></Suspense>} />
          <Route path="/errors" element={<Suspense fallback={<LoadingScreen />}><Errors /></Suspense>} />

          {/* Existing/Advanced Screens */}
          <Route path="/mission-control" element={<Suspense fallback={<LoadingScreen />}><MissionControl /></Suspense>} />
          <Route path="/founder-governance" element={<Suspense fallback={<LoadingScreen />}><FounderGovernance /></Suspense>} />

          {/* Content Generation Modes */}
          <Route path="/content/photo-gen" element={<Suspense fallback={<LoadingScreen />}><PhotoGenMode /></Suspense>} />
          <Route path="/content/script-gen" element={<Suspense fallback={<LoadingScreen />}><ScriptGenMode /></Suspense>} />
          <Route path="/content/debate" element={<Suspense fallback={<LoadingScreen />}><DebateMode /></Suspense>} />
          <Route path="/content/video-creator" element={<Suspense fallback={<LoadingScreen />}><VideoCreatorMode /></Suspense>} />
          <Route path="/content/avatar-creator" element={<Suspense fallback={<LoadingScreen />}><AvatarCreatorMode /></Suspense>} />
          <Route path="/content/music" element={<Suspense fallback={<LoadingScreen />}><MusicMode /></Suspense>} />
          <Route path="/content/songs" element={<Suspense fallback={<LoadingScreen />}><SongsMode /></Suspense>} />
          <Route path="/content/poetry" element={<Suspense fallback={<LoadingScreen />}><PoetryMode /></Suspense>} />

          <Route path="/workflows" element={<PlaceholderScreen title="Workflows" description="List and monitor all workflows" />} />
          <Route path="/workflows/:workflowId/monitor" element={<Suspense fallback={<LoadingScreen />}><WorkflowMonitor /></Suspense>} />
          <Route path="/dossiers/:dossierId/inspector" element={<Suspense fallback={<LoadingScreen />}><DossierViewer /></Suspense>} />
          <Route path="/pipelines/topic-intelligence" element={<Suspense fallback={<LoadingScreen />}><TopicPipeline /></Suspense>} />
          <Route path="/research" element={<PlaceholderScreen title="Research" description="View research outputs and evidence" />} />
          <Route path="/research/:dossierId" element={<Suspense fallback={<LoadingScreen />}><ResearchPanel /></Suspense>} />
          <Route path="/script" element={<PlaceholderScreen title="Scripts" description="View generated scripts and drafts" />} />
          <Route path="/script/:dossierId" element={<Suspense fallback={<LoadingScreen />}><ScriptDebatePanel /></Suspense>} />
          <Route path="/context" element={<PlaceholderScreen title="Context" description="View execution contexts and specifications" />} />
          <Route path="/context/:dossierId" element={<Suspense fallback={<LoadingScreen />}><ContextPacketPanel /></Suspense>} />
          <Route path="/media" element={<PlaceholderScreen title="Media" description="View media assets and specifications" />} />
          <Route path="/publishing" element={<PlaceholderScreen title="Publishing" description="View publishing status and metadata" />} />
          <Route path="/planning/resources" element={<Suspense fallback={<LoadingScreen />}><ResourcePlanner /></Suspense>} />
          <Route path="/alerts" element={<Suspense fallback={<LoadingScreen />}><AlertCenter /></Suspense>} />
          <Route path="/troubleshoot" element={<Suspense fallback={<LoadingScreen />}><TroubleshootConsole /></Suspense>} />
          <Route path="/replay/:dossierId" element={<Suspense fallback={<LoadingScreen />}><ReplayConsole /></Suspense>} />
          <Route path="/analytics/:dossierId" element={<Suspense fallback={<LoadingScreen />}><AnalyticsDashboard /></Suspense>} />
          <Route path="/learning" element={<Suspense fallback={<LoadingScreen />}><SelfLearningDashboard /></Suspense>} />
          <Route path="/settings" element={<Suspense fallback={<LoadingScreen />}><SettingsRegistry /></Suspense>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
