import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ErrorBoundary from './ErrorBoundary';

export default function Layout({ children }) {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-shadow-dark text-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-shadow-dark p-6">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
