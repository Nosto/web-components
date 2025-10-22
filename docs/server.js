#!/usr/bin/env node

import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.md': 'text/markdown'
};

const server = createServer((req, res) => {
  let filePath = req.url === '/' ? '/presentation.html' : req.url;
  
  // Handle root-level node_modules access
  if (filePath.startsWith('/node_modules/')) {
    filePath = join(__dirname, '..', filePath);
  } else {
    filePath = join(__dirname, filePath);
  }

  const ext = extname(filePath).toLowerCase();
  const mimeType = mimeTypes[ext] || 'application/octet-stream';

  try {
    const content = readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal server error');
    }
  }
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`🎬 Nosto Web Components Presentation server running at:`);
  console.log(`   http://localhost:${port}`);
  console.log('');
  console.log('📚 Auto Narration Controls:');
  console.log('   ▶️  Start Auto: Click "▶️ Start Auto" or Ctrl+Space');
  console.log('   ⏸️  Pause: Click "⏸️ Pause" or Ctrl+Space');
  console.log('   ⏹️  Stop: Click "⏹️ Stop" or Esc key');
  console.log('');
  console.log('🎮 Navigation:');
  console.log('   → Next slide: Arrow right, Space bar');
  console.log('   ← Previous slide: Arrow left');
  console.log('   📝 Speaker notes: Press "s" key');
  console.log('');
  console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down presentation server...');
  server.close(() => {
    process.exit(0);
  });
});