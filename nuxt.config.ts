import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    'shadcn-nuxt',
    '@vite-pwa/nuxt',
  ],

  app: {
    head: {
      link: [
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
      ],
      meta: [
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Calories' },
      ],
    },
  },

  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Calorie Tracker',
      short_name: 'Calories',
      theme_color: '#09090b',
      background_color: '#09090b',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
  },

  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  devtools: { enabled: true },
  compatibilityDate: '2024-12-01',
})
