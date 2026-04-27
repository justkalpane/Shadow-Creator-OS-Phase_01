#!/usr/bin/env node
/**
 * n8n Stop Script (Cross-platform)
 * Stops a local n8n process. Replaces the Linux-only `pkill -f 'n8n start'`.
 * On Windows uses taskkill; on POSIX uses pgrep + kill.
 */

const { execSync } = require('child_process');
const os = require('os');

const platform = os.platform();

try {
  if (platform === 'win32') {
    // Find node processes running n8n and terminate them
    try {
      const out = execSync('wmic process where "name=\'node.exe\'" get processid,commandline /format:csv', { encoding: 'utf8' });
      const lines = out.split('\n').filter((l) => l.toLowerCase().includes('n8n'));
      if (lines.length === 0) {
        console.log('No n8n processes found.');
        process.exit(0);
      }
      let killed = 0;
      lines.forEach((line) => {
        const parts = line.trim().split(',');
        const pid = parts[parts.length - 1];
        if (pid && /^\d+$/.test(pid.trim())) {
          try {
            execSync(`taskkill /PID ${pid.trim()} /F`, { stdio: 'pipe' });
            killed += 1;
          } catch {
            // ignore
          }
        }
      });
      console.log(`Stopped ${killed} n8n process(es).`);
      process.exit(0);
    } catch (error) {
      console.error('Failed to query processes via wmic:', error.message);
      console.error('Falling back: open Task Manager to stop n8n manually.');
      process.exit(1);
    }
  } else {
    // POSIX
    try {
      execSync("pkill -f 'n8n start' || true", { stdio: 'inherit' });
      console.log('Sent SIGTERM to n8n processes (if any).');
      process.exit(0);
    } catch (error) {
      console.error('Failed to stop n8n:', error.message);
      process.exit(1);
    }
  }
} catch (error) {
  console.error('Unexpected error:', error.message);
  process.exit(1);
}
