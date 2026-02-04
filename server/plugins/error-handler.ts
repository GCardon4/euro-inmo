export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error: any, { event }: any) => {
    console.error('=== DETAILED ERROR ===')
    console.error('URL:', event?.node?.req?.url || 'unknown')
    console.error('Method:', event?.node?.req?.method || 'unknown')
    console.error('Error message:', error?.message || 'no message')
    console.error('Error stack:', error?.stack || 'no stack')
    console.error('Error name:', error?.name || 'no name')
    console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    console.error('=== END DETAILED ERROR ===')
  })
})
