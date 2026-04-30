const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const os = require("os");

const dbPath = path.join(os.homedir(), ".n8n", "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }

  // Get workflow_entity schema
  db.all("PRAGMA table_info(workflow_entity)", (err, columns) => {
    if (err) {
      console.error("Error:", err.message);
      process.exit(1);
    }

    console.log("workflow_entity columns:");
    columns.forEach(col => {
      console.log(`  ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : 'NULL'}`);
    });

    // Get a sample workflow
    db.all("SELECT * FROM workflow_entity LIMIT 1", (err, rows) => {
      if (rows && rows.length > 0) {
        console.log("\nSample workflow data:");
        Object.keys(rows[0]).forEach(key => {
          console.log(`  ${key}: ${rows[0][key]}`);
        });
      }

      db.close();
    });
  });
});
