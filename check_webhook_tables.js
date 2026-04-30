const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const os = require("os");

const dbPath = path.join(os.homedir(), ".n8n", "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }

  // Get all table names
  db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, tables) => {
    if (err) {
      console.error("Error:", err.message);
      process.exit(1);
    }

    console.log("Database tables:");
    const webhookRelated = [];
    tables.forEach(t => {
      console.log(`  - ${t.name}`);
      if (t.name.toLowerCase().includes('webhook') || t.name.toLowerCase().includes('trigger')) {
        webhookRelated.push(t.name);
      }
    });

    if (webhookRelated.length > 0) {
      console.log("\n📌 Webhook-related tables found:");
      webhookRelated.forEach(t => {
        console.log(`\n${t} schema:`);
        db.all(`PRAGMA table_info(${t})`, (err, cols) => {
          cols.forEach(c => console.log(`  ${c.name}: ${c.type}`));
          
          if (t === webhookRelated[webhookRelated.length - 1]) {
            db.close();
          }
        });
      });
    } else {
      console.log("\n⚠️  No webhook-related tables found");
      db.close();
    }
  });
});
