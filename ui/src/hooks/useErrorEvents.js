import { useState, useEffect } from 'react';

export const useErrorEvents = (autoRefresh = false) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadErrorEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/data/se_error_events.json');
      if (!response.ok) throw new Error(`Failed to load error events (${response.status})`);
      const json = await response.json();
      setData(json.error_events || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading error events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadErrorEvents();

    if (autoRefresh) {
      const interval = setInterval(loadErrorEvents, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getByStatus = (status) => data.filter(e => e.status === status);
  const getById = (errorId) => data.find(e => e.error_id === errorId);
  const getByDossier = (dossierId) => data.filter(e => e.dossier_ref === dossierId);
  const getByWorkflow = (workflowId) => data.filter(e => e.workflow_id === workflowId);
  const getTotalCount = () => data.length;
  const getActiveCount = () => getByStatus('active').length;
  const getResolvedCount = () => getByStatus('resolved').length;

  const getByErrorType = (type) => data.filter(e => e.error_type === type);

  const countByErrorType = () => {
    const counts = {};
    data.forEach(item => {
      counts[item.error_type] = (counts[item.error_type] || 0) + 1;
    });
    return counts;
  };

  const getSeverityDistribution = () => {
    const distribution = { critical: 0, high: 0, medium: 0, low: 0 };
    data.forEach(item => {
      const severity = item.severity || 'low';
      if (distribution.hasOwnProperty(severity)) {
        distribution[severity]++;
      }
    });
    return distribution;
  };

  return {
    data,
    loading,
    error,
    refresh: loadErrorEvents,
    getByStatus,
    getById,
    getByDossier,
    getByWorkflow,
    getTotalCount,
    getActiveCount,
    getResolvedCount,
    getByErrorType,
    countByErrorType,
    getSeverityDistribution,
  };
};
