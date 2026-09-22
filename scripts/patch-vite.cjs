const fs = require('fs');
const path = require('path');

const filesToPatch = [
  path.join(__dirname, '..', 'node_modules', 'vite', 'dist', 'client', 'client.mjs'),
  path.join(__dirname, '..', 'node_modules', 'vite', 'dist', 'node', 'module-runner.js')
];

for (const file of filesToPatch) {
  if (fs.existsSync(file)) {
    try {
      let content = fs.readFileSync(file, 'utf8');
      if (content.includes('ws.send(JSON.stringify(data));') && !content.includes('ws && ws.readyState === 1')) {
        content = content.replace(
          'ws.send(JSON.stringify(data));',
          'if (ws && ws.readyState === 1) { ws.send(JSON.stringify(data)); }'
        );
        fs.writeFileSync(file, content, 'utf8');
        console.log(`[patch-vite] Patched ${path.basename(file)}`);
      }
    } catch (err) {
      console.warn(`[patch-vite] Could not patch ${file}:`, err.message);
    }
  }
}
