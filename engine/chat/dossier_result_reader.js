const fs = require('fs');
const path = require('path');

class DossierResultReader {
  constructor() {
    this.indexPath = path.join(__dirname, '../../data/se_dossier_index.json');
    this.dossierDir = path.join(__dirname, '../../dossiers');
    this.refresh();
  }

  refresh() {
    this.index = this.readJsonSafe(this.indexPath, { dossiers: [] });
  }

  readJsonSafe(file, fallback) {
    try {
      if (!fs.existsSync(file)) return fallback;
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      return fallback;
    }
  }

  writeJson(file, value) {
    fs.writeFileSync(file, JSON.stringify(value, null, 2), 'utf8');
  }

  getRecords() {
    if (Array.isArray(this.index?.dossiers)) return this.index.dossiers;
    if (Array.isArray(this.index?.records)) return this.index.records;
    return [];
  }

  getAllDossiers() {
    this.refresh();
    return this.getRecords();
  }

  getDossierSummary(dossierId) {
    const dossiers = this.getAllDossiers();
    const rec = dossiers.find((d) => d.dossier_id === dossierId);
    if (!rec) {
      return { dossier_id: dossierId, status: 'unknown', workflow_stage: null };
    }
    return {
      dossier_id: rec.dossier_id,
      status: rec.status || 'unknown',
      workflow_stage: rec.current_stage || rec.workflow_stage || null,
      created_at: rec.created_at || null,
      updated_at: rec.updated_at || null,
    };
  }

  createDossier(topic, metadata = {}) {
    this.refresh();
    const now = new Date().toISOString();
    const dossier_id = `dossier-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const rec = {
      dossier_id,
      topic,
      status: 'created',
      created_at: now,
      current_stage: 'WF-001',
      ...metadata,
    };

    const data = this.index && typeof this.index === 'object' ? this.index : { dossiers: [] };
    if (!Array.isArray(data.dossiers)) data.dossiers = this.getRecords();
    data.dossiers.push(rec);
    data.last_updated = now;
    this.writeJson(this.indexPath, data);
    return rec;
  }

  updateDossierStatus(dossierId, status, extra = {}) {
    this.refresh();
    const data = this.index && typeof this.index === 'object' ? this.index : { dossiers: [] };
    if (!Array.isArray(data.dossiers)) data.dossiers = this.getRecords();
    const idx = data.dossiers.findIndex((d) => d.dossier_id === dossierId);
    const now = new Date().toISOString();
    if (idx >= 0) {
      data.dossiers[idx] = { ...data.dossiers[idx], status, updated_at: now, ...extra };
    }
    data.last_updated = now;
    this.writeJson(this.indexPath, data);
    return idx >= 0;
  }
}

module.exports = DossierResultReader;
