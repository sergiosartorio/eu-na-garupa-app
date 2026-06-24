import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Eu Na Garupa — Suas Fotos',
        short_name: 'Eu Na Garupa',
        description: 'Encontre rápido suas fotos no Só Foto após passar nos pontos do Eu Na Garupa.',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Não cacheia chamadas da Netlify Function — sempre busca rede
        runtimeCaching: [
          {
            urlPattern: /\/.netlify\/functions\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'netlify-functions',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 min
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    // Em dev, redireciona /.netlify/functions/* para o Netlify Dev (porta 8888)
    // Se rodar `netlify dev`, ele cuida disso automaticamente.
  }
});
