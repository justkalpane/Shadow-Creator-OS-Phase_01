const sqlite3 = require('sqlite3').verbose();
const dbPath = 'C:/ShadowEmpire/n8n_user/.n8n/database.sqlite';

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }

  // Get CWF-210 execution (id 1272)
  db.get(`
    SELECT id, executionId, dataType, data
    FROM execution_data
    WHERE executionId = 1272
    LIMIT 1
  `, [], (err, row) => {
    if (err) {
      console.error('Query error:', err.message);
      db.close();
      process.exit(1);
    }

    if (row) {
      console.log('Found execution_data for exec 1272');
      if (row.data) {
        try {
          const data = JSON.parse(row.data);
          console.log('\n=== CWF-210 EXECUTION OUTPUT ===\n');
          console.log(JSON.stringify(data, null, 2).substring(0, 2000));
        } catch (e) {
          console.log('Raw data:', row.data.substring(0, 2000));
        }
      }
    } else {
      // Try getting all execution_data for this exec
      db.all(`
        SELECT executionId, dataType FROM execution_data 
        WHERE executionId = 1272
      `, [], (err, rows) => {
        console.log('execution_data rows for 1272:', rows.length);
        if (rows.length > 0) {
          console.log('Data types:', rows.map(r => r.dataType));
        }
        db.close();
        process.exit(0);
      });
      return;
    }

    db.close();
    process.exit(0);
  });
});
