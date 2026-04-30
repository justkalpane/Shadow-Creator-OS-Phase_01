import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import './index.css';

const Dashboard = lazy(() => import('./screens/Dashboard'));
const Chat = lazy(() => import('./screens/Chat'));
const Overview = lazy(() => import('./screens/Overview'));
const RoutesScreen = lazy(() => import('./screens/Routes'));
const Dossiers = lazy(() => import('./screens/Dossiers'));
const Approvals = lazy(() => import('./screens/Approvals'));
const Errors = lazy(() => import('./screens/Errors'));
const WorkflowMonitor = lazy(() => import('./screens/WorkflowMonitor'));
const Library = lazy(() => import('./screens/Library'));
const Gallery = lazy(() => import('./screens/Gallery'));
const AlertCenter = lazy(() => import('./screens/AlertCenter'));
const TroubleshootConsole = lazy(() => import('./screens/TroubleshootConsole'));
const SettingsRegistry = lazy(() => import('./screens/SettingsRegistry'));

const LoadingScreen = () => (
  <div className="space-y-6">
    <div className="h-8 w-48 bg-gray-700 rounded animate-pulse" />
    <div className="bg-shadow-card p-6 rounded border border-gray-700 h-64 animate-pulse" />
  </div>
);

const NotImplementedScreen = ({ title, screenId }) => (
  <div className="space-y-6 p-6">
    <h1 className="text-4xl font-bold">{title}</h1>
    <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-2 border-yellow-600 rounded-lg p-8 text-center">
      <h2 className="text-2xl font-bold text-yellow-400 mb-2">Screen Under Development</h2>
      <div className="text-xs text-gray-400 bg-black/30 p-3 rounded inline-block">
        <p className="font-mono">STATUS: NOT_IMPLEMENTED</p>
        <p>ID: {screenId}</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Suspense fallback={<LoadingScreen />}><Dashboard /></Suspense>} />
          <Route path="/dashboard" element={<Suspense fallback={<LoadingScreen />}><Dashboard /></Suspense>} />
          <Route path="/chat" element={<Suspense fallback={<LoadingScreen />}><Chat /></Suspense>} />

          <Route path="/overview" element={<Suspense fallback={<LoadingScreen />}><Overview /></Suspense>} />
          <Route path="/routes" element={<Suspense fallback={<LoadingScreen />}><RoutesScreen /></Suspense>} />
          <Route path="/dossiers" element={<Suspense fallback={<LoadingScreen />}><Dossiers /></Suspense>} />
          <Route path="/approvals" element={<Suspense fallback={<LoadingScreen />}><Approvals /></Suspense>} />
          <Route path="/errors" element={<Suspense fallback={<LoadingScreen />}><Errors /></Suspense>} />
          <Route path="/workflows" element={<Suspense fallback={<LoadingScreen />}><WorkflowMonitor /></Suspense>} />
          <Route path="/workflows/:workflowId/monitor" element={<Suspense fallback={<LoadingScreen />}><WorkflowMonitor /></Suspense>} />
          <Route path="/library" element={<Suspense fallback={<LoadingScreen />}><Library /></Suspense>} />
          <Route path="/gallery" element={<Suspense fallback={<LoadingScreen />}><Gallery /></Suspense>} />
          <Route path="/alerts" element={<Suspense fallback={<LoadingScreen />}><AlertCenter /></Suspense>} />
          <Route path="/troubleshoot" element={<Suspense fallback={<LoadingScreen />}><TroubleshootConsole /></Suspense>} />
          <Route path="/settings" element={<Suspense fallback={<LoadingScreen />}><SettingsRegistry /></Suspense>} />

          <Route path="/analytics/:dossierId" element={<NotImplementedScreen title="Analytics" screenId="SCR_ANALYTICS" />} />
          <Route path="/learning" element={<NotImplementedScreen title="Learning" screenId="SCR_LEARNING" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
