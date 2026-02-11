const BOT_USER_AGENTS = [
  'whatsapp',
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'linkedinbot',
  'slackbot',
  'telegrambot',
  'discordbot',
]

const SUPABASE_URL = 'https://kpfvjnlclaucgmjkkyvh.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZnZqbmxjbGF1Y2dtamtreXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTM3OTcsImV4cCI6MjA4MjY4OTc5N30.wMF60RtnzbCLcL_WBa_9jHcUCfBDUecrXjUFmfx7wNY'

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const supabaseHeaders = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const pathname = url.pathname

  // Solo interceptar páginas de propiedad
  const match = pathname.match(/^\/property-([a-zA-Z0-9_-]+)\/?$/)
  if (!match) return

  // Solo interceptar bots de redes sociales
  const userAgent = (getRequestHeader(event, 'user-agent') || '').toLowerCase()
  const isBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot))
  if (!isBot) return

  const propertyCode = match[1]

  try {
    // Consultar propiedad via Supabase REST API
    const properties = await $fetch<any[]>(`${SUPABASE_URL}/rest/v1/properties`, {
      headers: supabaseHeaders,
      params: {
        select: 'id,name,description,price,category(name),city(name),status(name)',
        code: `eq.${propertyCode}`,
        limit: '1',
      },
    })

    if (!properties || properties.length === 0) return

    const property = properties[0]

    // Consultar imagen principal
    const imagesData = await $fetch<any[]>(`${SUPABASE_URL}/rest/v1/properties_images`, {
      headers: supabaseHeaders,
      params: {
        select: 'url_image',
        property_id: `eq.${property.id}`,
        order: 'main.desc',
        limit: '1',
      },
    })

    const ogImage = imagesData?.[0]?.url_image || `${url.origin}/property-img.jpg`
    const ogTitle = property.name || 'Euro Inmobiliaria'
    const ogDescription = property.description || 'Propiedad disponible en Euro Inmobiliaria'
    const ogUrl = `https://euroinmobiliaria.com.co/property-${propertyCode}`

    // Precio formateado
    let priceText = ''
    if (property.price) {
      priceText = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(property.price)
    }

    // Descripción enriquecida para el preview
    const parts: string[] = []
    if (property.category?.name) parts.push(property.category.name)
    if (property.city?.name) parts.push(property.city.name)
    if (property.status?.name) parts.push(property.status.name)
    if (priceText) parts.push(priceText)
    const richDescription = parts.length > 0
      ? `${parts.join(' | ')}${ogDescription ? ' - ' + ogDescription : ''}`
      : ogDescription

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(ogTitle)} - Euro Inmobiliaria</title>
  <meta property="og:title" content="${escapeHtml(ogTitle)}" />
  <meta property="og:description" content="${escapeHtml(richDescription)}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${escapeHtml(ogUrl)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Euro Inmobiliaria" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(ogTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(richDescription)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
</head>
<body></body>
</html>`

    setResponseHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    return html
  } catch (err) {
    // Si falla, dejar pasar la request al SPA normalmente
    console.error('OG meta middleware error:', err)
    return
  }
})
