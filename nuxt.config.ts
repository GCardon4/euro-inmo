// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
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
        { rel: 'icon', type: 'image/svg+xml', href: '/logotipo-euro.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/logotipo-euro.svg' },
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
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_KEY || '',
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/property-*', '/contact']
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    },
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: false,
        persistSession: true,
        autoRefreshToken: true
      }
    }
  },

  // Configuración para producción
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true,
    routeRules: {
      '/': { ssr: true },
      '/admin/**': { ssr: true },
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/favicon.ico': { headers: { 'cache-control': 'public, max-age=86400' } },
      '/robots.txt': { headers: { 'cache-control': 'public, max-age=86400' } }
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