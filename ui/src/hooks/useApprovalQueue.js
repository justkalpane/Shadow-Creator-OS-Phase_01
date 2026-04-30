import { useState, useEffect } from 'react';

export const useApprovalQueue = (autoRefresh = false) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadApprovalQueue = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/data/se_approval_queue.json');
      if (!response.ok) throw new Error(`Failed to load approval queue (${response.status})`);
      const json = await response.json();
      setData(json.entries || json.approval_queue || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading approval queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovalQueue();

    if (autoRefresh) {
      const interval = setInterval(loadApprovalQueue, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

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
    refresh: loadApprovalQueue,
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
