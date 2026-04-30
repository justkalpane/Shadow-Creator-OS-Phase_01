const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const os = require("os");

const dbPath = path.join(os.homedir(), ".n8n", "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }

  // Get the webhook for WF-001
  db.all("SELECT * FROM webhook_entity WHERE webhookPath LIKE '%wf-001%' LIMIT 1", (err, rows) => {
    if (rows && rows.length > 0) {
      console.log("WF-001 webhook raw data:");
      console.log(JSON.stringify(rows[0], null, 2));
    }

    // Get the WF-001 workflow
    db.all("SELECT id, versionId, activeVersionId FROM workflow_entity WHERE name LIKE '%WF-001%'", (err, rows) => {
      if (rows && rows.length > 0) {
        console.log("\nWF-001 workflow data:");
        console.log(JSON.stringify(rows[0], null, 2));
      }

      db.close();
    });
  });
});
