// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.equipilates.com.br',
  integrations: [react()],
  output: 'server',
  adapter: vercel(),
  build: {
    // Preservar arquivos estáticos da homepage
    assets: '_astro'
  },
  vite: {
    build: {
      // Otimização para produção
      cssMinify: true,
      minify: 'esbuild'
    }
  }
});