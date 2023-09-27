// tsup.config.js
import { defineConfig } from 'tsup';
import html from 'esbuild-plugin-html';

export default defineConfig({
  // ... outras configurações
  plugins: [html()],
});

