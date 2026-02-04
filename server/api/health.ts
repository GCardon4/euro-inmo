export default defineEventHandler(() => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    env: {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_KEY,
      nodeEnv: process.env.NODE_ENV,
      nitroHost: process.env.NITRO_HOST || 'not set',
      nitroPort: process.env.NITRO_PORT || 'not set'
    }
  }
})
