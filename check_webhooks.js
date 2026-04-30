const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const os = require("os");

const dbPath = path.join(os.homedir(), ".n8n", "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }

  // Count webhooks
  db.get("SELECT COUNT(*) as count FROM webhook_entity", (err, result) => {
    if (err) {
      console.error("Error:", err.message);
      process.exit(1);
    }

    console.log(`Total webhooks registered: ${result.count}`);

    // Get all webhooks for WF-001
    db.all("SELECT * FROM webhook_entity WHERE webhookPath LIKE '%wf-001%' OR node LIKE '%WF-001%' LIMIT 5", (err, rows) => {
      if (rows && rows.length > 0) {
        console.log("\n✅ WF-001 webhooks found:");
        rows.forEach(r => {
          console.log(`  Method: ${r.method}, Path: ${r.webhookPath}, Node: ${r.node}`);
        });
      } else {
        console.log("\n❌ No WF-001 webhooks registered!");
      }

      // Show first 10 webhooks
      db.all("SELECT webhookPath, method, node FROM webhook_entity LIMIT 10", (err, rows) => {
        if (rows && rows.length > 0) {
          console.log("\nFirst 10 registered webhooks:");
          rows.forEach(r => {
            console.log(`  ${r.method} ${r.webhookPath}`);
          });
        }

        db.close();
      });
    });
  });
});
