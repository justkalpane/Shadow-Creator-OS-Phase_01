import { useState, useEffect } from 'react';

export const usePacketIndex = (autoRefresh = false) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPacketIndex = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/data/se_packet_index.json');
      if (!response.ok) throw new Error(`Failed to load packet index (${response.status})`);
      const json = await response.json();
      setData(json.packets || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading packet index:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPacketIndex();

    if (autoRefresh) {
      const interval = setInterval(loadPacketIndex, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getByDossier = (dossierId) => data.filter(p => p.dossier_ref === dossierId);
  const getById = (packetId) => data.find(p => p.instance_id === packetId);
  const getByStatus = (status) => data.filter(p => p.status === status);
  const getByArtifactFamily = (family) => data.filter(p => p.artifact_family === family);
  const getByProducer = (workflowId) => data.filter(p => p.producer_workflow === workflowId);
  const getTotalCount = () => data.length;

  const getArtifactFamilies = () => {
    const families = new Set();
    data.forEach(p => families.add(p.artifact_family));
    return Array.from(families);
  };

  const countByStatus = (status) => getByStatus(status).length;

  const countByArtifactFamily = () => {
    const counts = {};
    data.forEach(item => {
      counts[item.artifact_family] = (counts[item.artifact_family] || 0) + 1;
    });
    return counts;
  };

  const getGeneratedImages = () => {
    return data.filter(p => p.artifact_family?.startsWith('generated_image'));
  };

  const getGeneratedScripts = () => {
    return data.filter(p => p.artifact_family?.startsWith('generated_script'));
  };

  const getLineageForDossier = (dossierId) => {
    const dossierPackets = getByDossier(dossierId);
    const graph = {};

    dossierPackets.forEach(packet => {
      const producer = packet.producer_workflow || 'UNKNOWN';
      if (!graph[producer]) {
        graph[producer] = [];
      }
      graph[producer].push(packet.instance_id);
    });

    return graph;
  };

  return {
    data,
    loading,
    error,
    refresh: loadPacketIndex,
    getByDossier,
    getById,
    getByStatus,
    getByArtifactFamily,
    getByProducer,
    getTotalCount,
    getArtifactFamilies,
    countByStatus,
    countByArtifactFamily,
    getGeneratedImages,
    getGeneratedScripts,
    getLineageForDossier,
  };
};
