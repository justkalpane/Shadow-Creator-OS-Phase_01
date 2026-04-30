const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const os = require("os");

const dbPath = path.join(os.homedir(), ".n8n", "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }

  // Get all webhooks, join with workflow to get the workflow name
  db.all(`
    SELECT 
      w.webhookId, 
      w.webhookPath,
      w.method,
      w.node,
      we.name as workflow_name
    FROM webhook_entity w
    LEFT JOIN workflow_entity we ON w.workflowId = we.id
    ORDER BY we.name
  `, (err, rows) => {
    if (err) {
      console.error("Error:", err.message);
      process.exit(1);
    }

    console.log("Actual Webhook IDs in database:\n");
    rows.forEach(r => {
      const wfName = r.workflow_name || 'UNKNOWN';
      console.log(`${wfName}:`);
      console.log(`  ID: ${r.webhookId}`);
      console.log(`  Path: /webhook/${r.webhookId}/trigger%2520node${r.webhookPath.split('trigger%2520node')[1] || ''}`);
      console.log();
    });

    db.close();
  });
});
