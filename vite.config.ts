import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({mode}) => {
  const base = mode === 'production' ? '/meisui/' : '/';
  return {
    base,
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    server: {
      port: 0,
      strictPort: false,
      host: true,
    },
    preview: {
      port: 4173,
      strictPort: false,
    },
  };
});