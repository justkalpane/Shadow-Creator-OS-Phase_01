import { useAppStore } from '../store/useAppStore';
import { useModeRouter } from '../hooks/useModeRouter';

export default function ScreenGate({ screenId, children }) {
  const { selectedMode } = useAppStore();
  const { canAccessScreen, getScreenDetails } = useModeRouter();

  if (!canAccessScreen(screenId, selectedMode)) {
    const screenDetails = getScreenDetails(screenId);
    const requiredModes = screenDetails?.target_roles?.join(', ') || 'Unknown';

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="max-w-md p-8 bg-shadow-card border border-gray-700 rounded">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-4">
            You don't have permission to access this screen in <span className="font-semibold text-blue-400">{selectedMode}</span> mode.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            <strong>Required modes:</strong> {requiredModes}
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 bg-shadow-accent hover:bg-blue-600 rounded transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
