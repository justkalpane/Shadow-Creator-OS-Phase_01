const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.N8N_USER_FOLDER ? 
  path.join(process.env.N8N_USER_FOLDER, '.n8n', 'database.sqlite') :
  path.join('C:/ShadowEmpire/n8n_user', '.n8n', 'database.sqlite');

console.log('Database:', dbPath);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }

  db.all(`
    SELECT id, workflowId, finished
    FROM execution_entity
    WHERE id >= 1272 AND id <= 1292
    ORDER BY id ASC
  `, [], (err, rows) => {
    if (err) {
      console.error('Query error:', err.message);
      db.close();
      process.exit(1);
    }

    console.log('Found', rows.length, 'executions\n');
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Workflow: ${row.workflowId}, Finished: ${row.finished}`);
    });

    db.close();
    process.exit(0);
  });
});
