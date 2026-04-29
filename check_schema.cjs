const sqlite3 = require('sqlite3').verbose();
const dbPath = 'C:/ShadowEmpire/n8n_user/.n8n/database.sqlite';

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }

  db.all(`
    SELECT name FROM sqlite_master WHERE type='table' ORDER BY name
  `, [], (err, tables) => {
    if (err) {
      console.error('Error:', err.message);
      db.close();
      process.exit(1);
    }

    console.log('Tables in n8n database:');
    tables.forEach(t => console.log('  -', t.name));

    // Get sample execution data
    db.get(`PRAGMA table_info(execution_entity)`, [], (err, row) => {
      console.log('\nColumns in execution_entity:');
      
      db.all(`PRAGMA table_info(execution_entity)`, [], (err, cols) => {
        if (cols) {
          cols.forEach(c => console.log('  -', c.name, c.type));
        }
        db.close();
        process.exit(0);
      });
    });
  });
});
