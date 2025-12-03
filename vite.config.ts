import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['makeup-icon.svg', 'manifest-icon-*.png', 'apple-icon-*.png', 'apple-splash-*.jpg'],
      base: mode === 'development' ? '/' : '/MakeupManager_v2/',
      manifest: {
        name: 'MakeUp Manager - Gestão Profissional',
        short_name: 'MakeUp Manager',
        description: 'Sistema completo de gestão para maquiladoras profissionais',
        start_url: mode === 'development' ? '/' : '/MakeupManager_v2/',
        scope: mode === 'development' ? '/' : '/MakeupManager_v2/',
        display: 'standalone',
        background_color: '#FF6B9D',
        theme_color: '#FF6B9D',
        orientation: 'portrait',
        icons: [
          {
            src: '/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            // Supabase API - Network First (sempre tenta buscar dados frescos)
            urlPattern: /^https:\/\/criawfiupggpgmxljndc\.supabase\.co\/rest\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 horas
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            // Supabase Storage - Cache First (imagens não mudam)
            urlPattern: /^https:\/\/criawfiupggpgmxljndc\.supabase\.co\/storage\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-storage',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
              }
            }
          },
          {
            // Static assets - Cache First
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
              }
            }
          }
        ],
        // Excluir endpoints de autenticação do cache
        navigateFallbackDenylist: [/^\/auth/, /^\/api\/auth/]
      },
      devOptions: {
        enabled: false // Desabilitar em dev para evitar conflitos
      }
    })
  ],
  base: mode === 'development' ? '/' : '/MakeupManager_v2/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Configurações específicas para GitHub Pages
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // Configurações adicionais para GitHub Pages
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }
}))