class ReviewManager {
  constructor(n8nClient) {
    this.n8n = n8nClient;
  }

  async approveOutput(dossierId, reviewer = 'founder') {
    return this.n8n.trigger('WF-020', {
      dossier_id: dossierId,
      decision: 'approved',
      reviewer,
    });
  }

  async requestChanges(dossierId, instructions, reviewer = 'founder') {
    return this.n8n.trigger('WF-020', {
      dossier_id: dossierId,
      decision: 'rejected',
      reviewer,
      feedback: instructions || 'Requesting revisions',
    });
  }

  async replayStage(dossierId, stage, checkpoint = 'latest', remodifyInstructions = null) {
    return this.n8n.trigger('WF-021', {
      dossier_id: dossierId,
      stage: stage || 'script',
      checkpoint,
      remodify_instructions: remodifyInstructions,
    });
  }
}

module.exports = ReviewManager;

