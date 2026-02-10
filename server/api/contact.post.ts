import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // Validate required fields
  const { name, email, phone, interest, message, recaptchaToken } = body

  if (!name || !email || !phone || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Faltan campos obligatorios (nombre, email, teléfono, mensaje).'
    })
  }

  if (!recaptchaToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token de reCAPTCHA requerido.'
    })
  }

  // Verify reCAPTCHA v3 token
  try {
    const recaptchaResponse = await $fetch<{
      success: boolean
      score: number
      action: string
      'error-codes'?: string[]
    }>('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: config.recaptchaSecretKey,
        response: recaptchaToken
      }).toString()
    })

    if (!recaptchaResponse.success || recaptchaResponse.score < 0.5) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Verificación de reCAPTCHA fallida. Intenta nuevamente.'
      })
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al verificar reCAPTCHA.'
    })
  }

  // Send email via Resend
  const resend = new Resend(config.resendApiKey)

  const interestLabel: Record<string, string> = {
    comprar: 'Comprar',
    arrendar: 'Arrendar',
    vender: 'Vender mi propiedad',
    'asesoría': 'Asesoría general'
  }

  try {
    await resend.emails.send({
      from: 'Euro Inmobiliaria <onboarding@resend.dev>',
      to: ['admin@gustavocardona.com'],
      subject: `Nuevo contacto: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0b6182; border-bottom: 2px solid #0b6182; padding-bottom: 10px;">
            Nuevo mensaje de contacto
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #374151; width: 140px;">Nombre:</td>
              <td style="padding: 8px 12px; color: #585857;">${name}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 8px 12px; font-weight: bold; color: #374151;">Email:</td>
              <td style="padding: 8px 12px; color: #585857;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #374151;">Teléfono:</td>
              <td style="padding: 8px 12px; color: #585857;">${phone}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 8px 12px; font-weight: bold; color: #374151;">Interesado en:</td>
              <td style="padding: 8px 12px; color: #585857;">${interestLabel[interest] || 'No especificado'}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f3f4f6; border-radius: 8px;">
            <h3 style="margin: 0 0 8px 0; color: #374151;">Mensaje:</h3>
            <p style="margin: 0; color: #585857; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
            Enviado desde el formulario de contacto de euroinmobiliaria.com
          </p>
        </div>
      `
    })
  } catch (error: any) {
    console.error('Error sending email:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al enviar el correo. Intenta nuevamente más tarde.'
    })
  }

  return { success: true, message: '¡Mensaje enviado con éxito!' }
})
