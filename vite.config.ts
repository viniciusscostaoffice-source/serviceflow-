import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png'],
        manifest: {
          name: 'ServiceFlow Oficina',
          short_name: 'ServiceFlow',
          description: 'Gestão de ordens de serviço e comissões para oficinas',
          theme_color: '#FF6B1A',
          background_color: '#F5F5F0',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/dashboard',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'supabase-cache',
                expiration: { maxEntries: 50, maxAgeSeconds: 300 },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
