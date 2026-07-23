import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '氷河日本語',
        short_name: '氷河日本語',
        description: '面向中文初学者的现代日语学习应用',
        theme_color: '#f7f5f0',
        background_color: '#f7f5f0',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/android-chrome-384x384.png', sizes: '384x384', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,webp,png,svg}'],
        globIgnores: ['**/assets/audio/**'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/assets/audio/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'lesson-audio',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/assets/lesson-images/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'lesson-images',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 90 },
            },
          },
        ],
      },
    }),
    viteStaticCopy({
      targets: [
        { src: 'assets/audio/**/*', dest: 'assets', rename: { stripBase: 1 } },
        { src: 'assets/lesson-images/**/*', dest: 'assets', rename: { stripBase: 1 } },
        { src: 'assets/icons/android-chrome-*.png', dest: 'icons', rename: { stripBase: true } },
        { src: 'assets/deploy/_redirects', dest: '', rename: { stripBase: true } },
      ],
    }),
  ],
  publicDir: false,
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  build: {
    target: 'es2022',
  },
})
