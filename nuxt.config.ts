// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt'
  ],

  css: ['~/css/main.css'],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Euro Inmo - Bienes Raíces Oriente Antioqueño',
      meta: [
        { name: 'description', content: 'Encuentra tu hogar ideal en el Oriente Antioqueño' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/logotipo-euroinmo.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/logotipo-euroinmo.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/logotipo-euroinmo.png' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/properties', '/about', '/contact', '/property-*']
    }
  },

  // Configuración para producción
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true,
    routeRules: {
      '/': { ssr: false },
      '/properties': { ssr: false },
      '/about': { ssr: false },
      '/contact': { ssr: false },
      '/property-*': { ssr: false },
      '/admin/**': { ssr: true },
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/favicon.ico': { headers: { 'cache-control': 'public, max-age=86400' } },
      '/robots.txt': { headers: { 'cache-control': 'public, max-age=86400' } },
      '/**/*.svg': { headers: { 'cache-control': 'public, max-age=86400' } },
      '/**/*.png': { headers: { 'cache-control': 'public, max-age=86400' } }
    }
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || ''
    }
  },

  ssr: true,

  // Optimizaciones de build
  vite: {
    build: {
      cssMinify: 'esbuild'
    }
  }
})