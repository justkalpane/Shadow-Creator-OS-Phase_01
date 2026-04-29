const sqlite3 = require('sqlite3').verbose();
const dbPath = 'C:/ShadowEmpire/n8n_user/.n8n/database.sqlite';

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }

  db.all(`PRAGMA table_info(execution_data)`, [], (err, cols) => {
    if (err) {
      console.error('Error:', err.message);
      db.close();
      process.exit(1);
    }

    console.log('Columns in execution_data:');
    cols.forEach(c => console.log('  -', c.name, c.type));

    // Get sample rows
    db.all(`SELECT * FROM execution_data LIMIT 1`, [], (err, rows) => {
      console.log('\nSample row:');
      if (rows && rows[0]) {
        Object.keys(rows[0]).forEach(k => {
          const val = rows[0][k];
          console.log(`  ${k}: ${val && val.toString().substring(0, 100)}`);
        });
      }

      db.close();
      process.exit(0);
    });
  });
});
