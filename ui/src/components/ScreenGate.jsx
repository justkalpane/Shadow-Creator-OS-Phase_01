import { useAppStore } from '../store/useAppStore';
import { useModeRouter } from '../hooks/useModeRouter';

/**
 * Screen Access Gate Component
 *
 * Wraps screens to enforce role-based access control.
 * Shows access denied message if user's mode doesn't have permission.
 */
export default function ScreenGate({ screenId, children }) {
  const { selectedMode } = useAppStore();
  const { canAccessScreen, getScreenLabel } = useModeRouter();

  if (!canAccessScreen(screenId, selectedMode)) {
    const screenLabel = getScreenLabel(screenId);
    return (
      <div className="flex items-center justify-center h-full bg-shadow-bg">
        <div className="bg-shadow-card border border-red-600 rounded-lg p-8 max-w-md text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-300 mb-6">
            You don't have permission to access <span className="font-semibold">{screenLabel}</span>
          </p>
          <div className="bg-gray-800 rounded p-4 mb-6">
            <p className="text-sm text-gray-400">Your mode: <span className="text-blue-400 font-semibold">{selectedMode}</span></p>
            <p className="text-xs text-gray-500 mt-2">
              Only users with higher privileges can access this screen.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors font-semibold"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
