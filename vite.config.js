import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const currentDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
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
