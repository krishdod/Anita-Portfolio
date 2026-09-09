import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { releaseAssets } from './scripts/release-assets.mjs'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react(), {
    name: 'publish-used-assets-only',
    apply: 'build',
    async generateBundle() {
      for (const fileName of releaseAssets) {
        this.emitFile({ type: 'asset', fileName, source: await readFile(path.join(root, 'public', fileName)) })
      }
    },
  }],
  build: {
    copyPublicDir: false,
    // Preserve the site's existing modern-browser support across the build-tool update.
    target: ['es2020', 'chrome87', 'edge88', 'firefox78', 'safari14'],
  },
  resolve: {
    alias: {
      '@': path.resolve(root, './src'),
    },
  },
})
