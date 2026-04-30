import { useState, useEffect, useCallback } from 'react';

export const useDossierData = (autoRefresh = false) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadDossiers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/data/se_dossier_index.json');
      if (!response.ok) throw new Error(`Failed to load dossiers (${response.status})`);
      const json = await response.json();
      setData(json.records || json.dossiers || []);
      setRetryCount(0);
    } catch (err) {
      setError(err.message);
      console.error('Error loading dossiers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    loadDossiers();
  }, [loadDossiers]);

  useEffect(() => {
    loadDossiers();

    if (autoRefresh) {
      const interval = setInterval(loadDossiers, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, loadDossiers]);

  const getByStatus = (status) => data.filter(d => d.status === status);
  const getById = (dossierId) => data.find(d => d.dossier_id === dossierId);
  const countByStatus = (status) => getByStatus(status).length;
  const getTotalCount = () => data.length;
  const getApprovedCount = () => countByStatus('APPROVED');
  const getFailedCount = () => countByStatus('FAILED');
  const getPendingCount = () => countByStatus('PENDING');

  return {
    data,
    loading,
    error,
    retryCount,
    refresh: loadDossiers,
    retry,
    getByStatus,
    getById,
    countByStatus,
    getTotalCount,
    getApprovedCount,
    getFailedCount,
    getPendingCount,
  };
};
