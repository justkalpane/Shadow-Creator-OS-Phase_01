const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
const os = require("os");
const YAML = require("js-yaml");

const dbPath = path.join(os.homedir(), ".n8n", "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }

  // Get all workflows and webhooks
  db.all(`
    SELECT 
      we.id,
      we.name,
      wh.webhookPath,
      wh.method,
      wh.node
    FROM workflow_entity we
    LEFT JOIN webhook_entity wh ON wh.workflowId = we.id
    WHERE we.active = 1
    ORDER BY we.name
  `, (err, rows) => {
    if (err) {
      console.error("❌ Query error:", err.message);
      process.exit(1);
    }

    console.log("Active workflows with webhooks:\n");
    const updates = {};
    
    rows.forEach(r => {
      if (r.webhookPath) {
        const wfId = r.id;
        // Extract the webhook path parts
        const pathParts = r.webhookPath.split('/');
        const nodePart = r.webhookPath.split('trigger%20node')[1] || '';
        
        updates[r.name] = {
          path: `/webhook/${wfId}/trigger%2520node${nodePart}`,
          oldName: r.name
        };
        
        console.log(`${r.name}:`);
        console.log(`  ID: ${wfId}`);
        console.log(`  Path: /webhook/${wfId}/trigger%2520node${nodePart}`);
      }
    });

    // Load and update the registry
    const registryPath = "C:/ShadowEmpire-Git/registries/n8n_webhook_registry.yaml";
    const registryYaml = fs.readFileSync(registryPath, 'utf8');
    const registry = YAML.load(registryYaml);

    console.log("\n📝 Updating registry...");

    let updated = 0;
    Object.entries(registry.webhooks).forEach(([key, webhook]) => {
      // Try to match workflow name
      const match = Object.entries(updates).find(([wfName, data]) => {
        return key === wfName || 
               key.includes(wfName) || 
               wfName.includes(key) ||
               webhook.name === wfName;
      });

      if (match) {
        const [wfName, data] = match;
        const oldPath = webhook.webhook_path;
        webhook.webhook_path = data.path;
        console.log(`✅ ${key}: ${oldPath.substring(0, 60)}... → ${data.path.substring(0, 60)}...`);
        updated++;
      }
    });

    // Write updated registry
    fs.writeFileSync(registryPath, YAML.dump(registry));
    
    console.log(`\n✅ Updated ${updated} webhook paths`);
    db.close();
    process.exit(0);
  });
});
