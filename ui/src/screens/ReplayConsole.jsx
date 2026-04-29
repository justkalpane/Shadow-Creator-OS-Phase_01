export default function ReplayConsole() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Replay Console</h1>
      <div className="bg-shadow-card p-8 rounded border border-gray-700 text-center text-gray-400">
        <p className="text-lg">Checkpoint-based replay and recovery</p>
        <p className="text-sm mt-2">Select stage, confirm recovery, execute replay from checkpoint</p>
      </div>
    </div>
  );
}
