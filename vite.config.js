import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: 'src/js/main.js',
      output: {
        entryFileNames: 'assets/main.js'
      }
    },
    outDir: 'public',
    emptyOutDir: false
  }
});