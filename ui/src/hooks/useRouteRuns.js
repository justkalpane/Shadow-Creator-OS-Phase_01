import { useState, useEffect } from 'react';

export const useRouteRuns = (autoRefresh = false) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRouteRuns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/data/se_route_runs.json');
      if (!response.ok) throw new Error(`Failed to load route runs (${response.status})`);
      const json = await response.json();
      setData(json.route_runs || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading route runs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRouteRuns();

    if (autoRefresh) {
      const interval = setInterval(loadRouteRuns, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getByStatus = (status) => data.filter(r => r.status === status);
  const getByWorkflow = (workflowId) => data.filter(r => r.workflow_id === workflowId);
  const getById = (routeId) => data.find(r => r.route_run_id === routeId);
  const getTotalCount = () => data.length;
  const getSuccessCount = () => getByStatus('success').length;
  const getFailedCount = () => getByStatus('failed').length;

  const calculateDuration = (run) => {
    if (!run.started_at || !run.stopped_at) return null;
    return new Date(run.stopped_at) - new Date(run.started_at);
  };

  const getAverageDuration = (workflowId) => {
    const runs = workflowId ? getByWorkflow(workflowId) : data;
    if (runs.length === 0) return null;
    const durations = runs.map(calculateDuration).filter(d => d !== null);
    if (durations.length === 0) return null;
    return durations.reduce((a, b) => a + b, 0) / durations.length;
  };

  const getBottlenecks = () => {
    const byWorkflow = {};
    data.forEach(run => {
      if (!byWorkflow[run.workflow_id]) {
        byWorkflow[run.workflow_id] = { workflow_id: run.workflow_id, durations: [] };
      }
      const duration = calculateDuration(run);
      if (duration !== null) {
        byWorkflow[run.workflow_id].durations.push(duration);
      }
    });

    return Object.values(byWorkflow)
      .map(item => ({
        workflow_id: item.workflow_id,
        avg_duration: item.durations.reduce((a, b) => a + b, 0) / item.durations.length,
      }))
      .sort((a, b) => b.avg_duration - a.avg_duration);
  };

  return {
    data,
    loading,
    error,
    refresh: loadRouteRuns,
    getByStatus,
    getByWorkflow,
    getById,
    getTotalCount,
    getSuccessCount,
    getFailedCount,
    calculateDuration,
    getAverageDuration,
    getBottlenecks,
  };
};
