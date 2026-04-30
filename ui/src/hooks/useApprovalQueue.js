import { useState, useEffect, useCallback } from 'react';

export const useApprovalQueue = (autoRefresh = false) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadApprovalQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/data/se_approval_queue.json');
      if (!response.ok) throw new Error(`Failed to load approval queue (${response.status})`);
      const json = await response.json();
      setData(json.entries || json.approval_queue || []);
      setRetryCount(0);
    } catch (err) {
      setError(err.message);
      console.error('Error loading approval queue:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    loadApprovalQueue();
  }, [loadApprovalQueue]);

  useEffect(() => {
    loadApprovalQueue();

    if (autoRefresh) {
      const interval = setInterval(loadApprovalQueue, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, loadApprovalQueue]);

  const getByStatus = (status) => data.filter(a => a.status === status);
  const getById = (queueId) => data.find(a => a.queue_entry_id === queueId);
  const getByDossier = (dossierId) => data.filter(a => a.dossier_ref === dossierId);
  const getTotalCount = () => data.length;
  const getPendingCount = () => getByStatus('PENDING').length;
  const getResolvedCount = () => getByStatus('RESOLVED').length;
  const getByApprovalType = (type) => data.filter(a => a.approval_type === type);

  const countByApprovalType = () => {
    const counts = {};
    data.forEach(item => {
      counts[item.approval_type] = (counts[item.approval_type] || 0) + 1;
    });
    return counts;
  };

  return {
    data,
    loading,
    error,
    retryCount,
    refresh: loadApprovalQueue,
    retry,
    getByStatus,
    getById,
    getByDossier,
    getTotalCount,
    getPendingCount,
    getResolvedCount,
    getByApprovalType,
    countByApprovalType,
  };
};
