import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],

    base: env.VITE_BASE_URL ?? '/',

    resolve: {
      alias: {
        src: resolve(__dirname, './src'),
      },
    },

    build: {
      target: 'es2019',
      sourcemap: false,
      minify: 'esbuild',
      chunkSizeWarningLimit: 500,

      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'quasar-vendor': ['quasar', '@quasar/extras'],
            'axios-vendor': ['axios'],
          },
        },
      },

      reportCompressedSize: true,
    },

    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'axios', 'quasar'],
    },
  }
})
