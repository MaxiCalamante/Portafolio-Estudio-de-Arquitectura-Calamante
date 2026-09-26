// Supabase Edge Function: notify-inquiry
// Sends real-time notifications to Arq. Javier Calamante when a new lead is submitted.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

interface InquiryPayload {
  id?: number | string
  name: string
  email: string
  phone: string
  projectType: string
  canonicalType?: string
  location?: string
  budgetRange?: string
  message: string
}

serve(async (req: Request) => {
  // Manejo de CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const payload: InquiryPayload = await req.json()
    const { name, email, phone, projectType, location, budgetRange, message, id } = payload

    const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const adminEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || 'javiercalamantetandil@gmail.com'

    const timestamp = new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'America/Argentina/Buenos_Aires',
    }).format(new Date())

    const textSummary = `🏛 *NUEVA CONSULTA EN LA WEB · ESTUDIO JAVIER CALAMANTE*
📅 *Fecha:* ${timestamp}
👤 *Cliente:* ${name}
📞 *Teléfono:* ${phone}
✉️ *Email:* ${email}
📐 *Tipología:* ${projectType}
📍 *Zona:* ${location || 'No especificada'}
📊 *Situación:* ${budgetRange || 'No especificada'}
${id ? `🆔 *ID Consulta:* #${id}` : ''}

💬 *Mensaje:*
${message}
`

    const results: Record<string, string> = {}

    // 1. Enviar alerta por Telegram si está configurado
    if (telegramToken && telegramChatId) {
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: textSummary,
            parse_mode: 'Markdown',
          }),
        })
        results.telegram = tgRes.ok ? 'sent' : `error: ${await tgRes.text()}`
      } catch (tgErr: unknown) {
        results.telegram = `exception: ${tgErr instanceof Error ? tgErr.message : String(tgErr)}`
      }
    }

    // 2. Enviar email por Resend si está configurado
    if (resendApiKey) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'Estudio Calamante <consultas@resend.dev>',
            to: [adminEmail],
            subject: `🏛 Nueva consulta de ${name} (${projectType} - Tandil)`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1c1c1a; background: #faf9f5; border-radius: 8px;">
                <h2 style="color: #141413; border-bottom: 2px solid #dfded6; padding-bottom: 10px;">Nueva Consulta de Proyecto</h2>
                <p><strong>Fecha:</strong> ${timestamp}</p>
                <div style="background: #ffffff; padding: 16px; border-radius: 6px; border: 1px solid #e5e4de; margin: 16px 0;">
                  <p style="margin: 6px 0;"><strong>Cliente:</strong> ${name}</p>
                  <p style="margin: 6px 0;"><strong>Teléfono:</strong> <a href="tel:${phone}">${phone}</a></p>
                  <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                  <p style="margin: 6px 0;"><strong>Tipo de obra:</strong> ${projectType}</p>
                  <p style="margin: 6px 0;"><strong>Zona / Terreno:</strong> ${location || 'No especificada'}</p>
                  <p style="margin: 6px 0;"><strong>Estado del lote:</strong> ${budgetRange || 'No especificada'}</p>
                </div>
                <div style="background: #ffffff; padding: 16px; border-radius: 6px; border: 1px solid #e5e4de;">
                  <h3 style="margin-top: 0; font-size: 1rem;">Mensaje del interesado:</h3>
                  <p style="white-space: pre-wrap; color: #403f3a;">${message}</p>
                </div>
                <div style="margin-top: 20px; text-align: center;">
                  <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="display: inline-block; background: #25d366; color: #ffffff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-right: 10px;">Contactar por WhatsApp</a>
                  <a href="mailto:${email}" style="display: inline-block; background: #141413; color: #ffffff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Responder por Email</a>
                </div>
              </div>
            `,
          }),
        })
        results.resend = resendRes.ok ? 'sent' : `error: ${await resendRes.text()}`
      } catch (emailErr: unknown) {
        results.resend = `exception: ${emailErr instanceof Error ? emailErr.message : String(emailErr)}`
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 200,
    })
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 400,
      }
    )
  }
})
