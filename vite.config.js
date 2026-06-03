import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const currentDir = fileURLToPath(new URL('.', import.meta.url));
const goldenRoot = resolve(currentDir, '../calcmed');

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function sendGoldenFile(req, res, next) {
  const rawUrl = (req.url || '').split('?')[0];
  const safePath = normalize(decodeURIComponent(rawUrl)).replace(/^(\.\.[/\\])+/, '');
  let filePath = resolve(join(goldenRoot, safePath));

  if (filePath !== goldenRoot && !filePath.startsWith(`${goldenRoot}${sep}`)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    next();
    return;
  }

  res.setHeader('Content-Type', contentTypes[extname(filePath)] || 'application/octet-stream');
  createReadStream(filePath).pipe(res);
}

function goldenMasterPlugin() {
  return {
    name: 'calcmed-golden-master',
    configureServer(server) {
      server.middlewares.use('/golden', sendGoldenFile);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/golden', sendGoldenFile);
    },
  };
}

export default defineConfig({
  plugins: [react(), goldenMasterPlugin()],
  build: {
    rollupOptions: {
      input: {
        // App mobile (frame 390px) + Admin de Escores (desktop) — duas páginas.
        main: resolve(currentDir, 'index.html'),
        admin: resolve(currentDir, 'admin.html'),
      },
    },
  },
});
