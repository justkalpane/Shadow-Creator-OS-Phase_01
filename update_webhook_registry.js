const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
const os = require("os");
const yaml = require("js-yaml");

const dbPath = path.join(os.homedir(), ".n8n", "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Database error:", err.message);
    process.exit(1);
  }

  // Get all workflows
  db.all("SELECT id, name FROM workflow_entity WHERE name LIKE 'WF-%' OR name LIKE 'CWF-%'", (err, workflows) => {
    if (err) {
      console.error("❌ Query error:", err.message);
      process.exit(1);
    }

    // Get all webhooks
    db.all("SELECT * FROM webhook_entity", (err, webhooks) => {
      if (err) {
        console.error("❌ Query error:", err.message);
        process.exit(1);
      }

      // Build a map of webhook path to workflow ID
      const webhookMap = {};
      webhooks.forEach(wh => {
        const wf = workflows.find(w => w.id === wh.workflowId);
        if (wf) {
          webhookMap[wf.name] = {
            id: wh.workflowId,
            path: wh.webhookPath
          };
        }
      });

      console.log("Found workflow-webhook mappings:");
      Object.entries(webhookMap).forEach(([name, data]) => {
        console.log(`${name}: ${data.id}`);
      });

      // Now update the registry YAML file
      const registryPath = "C:/ShadowEmpire-Git/registries/n8n_webhook_registry.yaml";
      const registry = yaml.load(fs.readFileSync(registryPath, 'utf8'));

      console.log("\n✅ Updating webhook registry...");

      Object.entries(webhookMap).forEach(([wfName, data]) => {
        // Match the workflow name to the registry key
        const regKey = Object.keys(registry.webhooks).find(k => {
          const regName = registry.webhooks[k].name || k;
          return regName.includes(wfName) || wfName.includes(k);
        }) || wfName;

        if (registry.webhooks[regKey]) {
          const oldPath = registry.webhooks[regKey].webhook_path;
          registry.webhooks[regKey].webhook_path = `/webhook/${data.id}/trigger%2520node/${data.path.split('/').pop()}`;
          console.log(`${regKey}: Updated path`);
        }
      });

      // Write back the updated registry
      fs.writeFileSync(registryPath, yaml.dump(registry));
      console.log("\n✅ Registry updated!");

      db.close();
      process.exit(0);
    });
  });
});
