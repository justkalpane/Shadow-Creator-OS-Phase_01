const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = 'C:/ShadowEmpire/n8n_user/.n8n/database.sqlite';

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }

  db.get(`
    SELECT id, workflowId, data
    FROM execution_entity
    WHERE id = 1272
  `, [], (err, row) => {
    if (err || !row) {
      console.error('No execution found');
      db.close();
      process.exit(1);
    }

    try {
      const execData = JSON.parse(row.data);
      console.log('\n=== CWF-210 Script Generation Execution ===\n');
      
      if (execData.resultData && execData.resultData.runData) {
        const runData = execData.resultData.runData;
        
        // Look for skill execution output
        Object.keys(runData).forEach(nodeKey => {
          if (runData[nodeKey] && runData[nodeKey][0] && runData[nodeKey][0].json) {
            const output = runData[nodeKey][0].json;
            console.log(`\nNode: ${nodeKey}`);
            console.log(JSON.stringify(output, null, 2).substring(0, 1000));
            console.log('...');
          }
        });
      }
      
      db.close();
      process.exit(0);
    } catch (e) {
      console.error('Parse error:', e.message);
      db.close();
      process.exit(1);
    }
  });
});
