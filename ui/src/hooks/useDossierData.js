import { useState, useEffect } from 'react';

export const useDossierData = (autoRefresh = false) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDossiers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/data/se_dossier_index.json');
      if (!response.ok) throw new Error(`Failed to load dossiers (${response.status})`);
      const json = await response.json();
      setData(json.dossiers || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading dossiers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDossiers();

    if (autoRefresh) {
      const interval = setInterval(loadDossiers, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

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
    refresh: loadDossiers,
    getByStatus,
    getById,
    countByStatus,
    getTotalCount,
    getApprovedCount,
    getFailedCount,
    getPendingCount,
  };
};
