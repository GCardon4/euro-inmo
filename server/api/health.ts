export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    env: {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_KEY,
      hasNuxtSupabaseUrl: !!process.env.NUXT_PUBLIC_SUPABASE_URL,
      hasNuxtSupabaseKey: !!process.env.NUXT_PUBLIC_SUPABASE_KEY,
      nodeEnv: process.env.NODE_ENV
    },
    runtimeConfig: {
      supabaseUrl: (config.public as any).supabase?.url ? 'set' : 'empty',
      supabaseKey: (config.public as any).supabase?.key ? 'set' : 'empty'
    }
  }
})
