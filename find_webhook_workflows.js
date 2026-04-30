const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const os = require("os");

const dbPath = path.join(os.homedir(), ".n8n", "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }

  // Get all active workflows
  db.all("SELECT id, name, nodes FROM workflow_entity WHERE active = 1", (err, workflows) => {
    if (err) {
      console.error("❌ Error:", err.message);
      process.exit(1);
    }

    console.log("Checking for Webhook trigger nodes in all active workflows:\n");
    
    let webhookWorkflows = [];
    workflows.forEach(wf => {
      try {
        const nodes = JSON.parse(wf.nodes || '[]');
        const hasWebhook = nodes.some(n => 
          n.type === 'n8n-nodes-base.webhook' || 
          n.type === 'n8n-nodes-base.webhookTrigger' ||
          n.name?.toLowerCase().includes('webhook')
        );
        
        if (hasWebhook) {
          webhookWorkflows.push(wf.name);
          console.log(`✅ ${wf.name} - HAS WEBHOOK TRIGGER`);
        }
      } catch (e) {
        console.log(`⚠️  ${wf.name} - Could not parse nodes`);
      }
    });

    console.log(`\n📊 Total workflows with webhook triggers: ${webhookWorkflows.length}`);
    console.log("Workflows:", webhookWorkflows);

    db.close();
  });
});
