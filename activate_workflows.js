const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const os = require("os");

// Build the correct path to n8n database
const dbPath = path.join(os.homedir(), ".n8n", "database.sqlite");
console.log("Database path:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database open error:", err);
    process.exit(1);
  }

  const critical_workflows = [
    "WF-001 Dossier Create Canonical",
    "WF-010 Parent Orchestrator Canonical",
    "WF-020 Final Approval Canonical",
    "WF-100 Topic Intelligence Pack Canonical",
    "WF-200 Script Intelligence Pack Canonical",
    "WF-300 Context Engineering Pack Canonical",
    "WF-400 Media Production Pack Canonical",
    "WF-500 Publishing Distribution Pack Canonical"
  ];

  console.log("\nActivating critical workflows...\n");

  let completed = 0;
  critical_workflows.forEach(wf => {
    db.run("UPDATE workflow_entity SET active = 1 WHERE name = ?", [wf], function(err) {
      completed++;
      if (err) {
        console.log(`${wf}: ERROR - ${err.message}`);
      } else if (this.changes > 0) {
        console.log(`${wf}: ✅ ACTIVATED`);
      } else {
        console.log(`${wf}: ⚠️ not found (may need exact name match)`);
      }
      
      if (completed === critical_workflows.length) {
        db.close(() => {
          console.log("\nDatabase updates complete!");
          process.exit(0);
        });
      }
    });
  });
});
