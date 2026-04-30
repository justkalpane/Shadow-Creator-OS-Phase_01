const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const os = require("os");

const dbPath = path.join(os.homedir(), ".n8n", "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Database error:", err.message);
    process.exit(1);
  }

  console.log("🔄 Activating ALL 37 workflows...\n");

  // Get all workflows
  db.all("SELECT id, name, versionId FROM workflow_entity", (err, workflows) => {
    if (err) {
      console.error("❌ Query error:", err.message);
      process.exit(1);
    }

    if (!workflows || workflows.length === 0) {
      console.log("⚠️  No workflows found");
      process.exit(1);
    }

    console.log(`Found ${workflows.length} workflows to activate:\n`);

    let completed = 0;
    let activated = 0;

    workflows.forEach(wf => {
      // Set active=1 AND activeVersionId=versionId
      db.run(
        "UPDATE workflow_entity SET active = 1, activeVersionId = ? WHERE id = ?",
        [wf.versionId, wf.id],
        function(err) {
          completed++;
          if (err) {
            console.log(`❌ ${wf.name}: ${err.message}`);
          } else if (this.changes > 0) {
            console.log(`✅ ${wf.name}`);
            activated++;
          }

          if (completed === workflows.length) {
            console.log(`\n✅ Successfully activated ${activated}/${workflows.length} workflows`);
            db.close(() => {
              console.log("\n🔄 Now restarting n8n...");
              process.exit(0);
            });
          }
        }
      );
    });
  });
});
