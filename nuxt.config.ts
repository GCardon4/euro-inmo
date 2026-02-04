// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
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
    url: process.env.SUPABASE_URL || 'https://kpfvjnlclaucgmjkkyvh.supabase.co',
    key: process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZnZqbmxjbGF1Y2dtamtreXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTM3OTcsImV4cCI6MjA4MjY4OTc5N30.wMF60RtnzbCLcL_WBa_9jHcUCfBDUecrXjUFmfx7wNY',
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/properties', '/about', '/contact', '/property-*']
    },
    clientOptions: {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  },

  nitro: {
    preset: 'node-server',
    logLevel: 3
  },

  // Desactivar SSR temporalmente para resolver problemas de despliegue
  // TODO: Reactivar SSR y resolver issues de "nuxt instance unavailable"
  ssr: false
})