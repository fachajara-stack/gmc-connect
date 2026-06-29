import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'GMC Connect <contact@gmc-colombia.com>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

// Pays (valeur anglaise canonique stockée en DB) → langue email acheteur
function countryToLang(country?: string | null): 'fr' | 'es' | 'en' {
  const c = (country ?? '').toLowerCase().trim()
  if (c === 'france') return 'fr'
  if (['spain', 'espagne', 'españa', 'espana'].includes(c)) return 'es'
  return 'en'
}

function dateFmt(iso: string, lang: 'fr' | 'es' | 'en' = 'fr') {
  const locale = lang === 'es' ? 'es-CO' : lang === 'en' ? 'en-GB' : 'fr-FR'
  return new Date(iso).toLocaleDateString(locale, {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function layout(content: string, lang: 'fr' | 'es' | 'en' = 'fr') {
  const footer = lang === 'es'
    ? 'GMC Connect · Marketplace B2B frutas tropicales · Colombia → Mundo'
    : lang === 'en'
    ? 'GMC Connect · B2B Marketplace tropical fruits · Colombia → World'
    : 'GMC Connect · Marketplace B2B fruits tropicaux · Colombie → Monde'

  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;">
<div style="padding:32px 16px;">
  <div style="max-width:520px;margin:0 auto;">

    <div style="text-align:center;margin-bottom:20px;">
      <div style="display:inline-block;background:#15803d;border-radius:10px;padding:8px 18px;">
        <span style="color:white;font-weight:700;font-size:15px;letter-spacing:1px;">GMC</span>
      </div>
    </div>

    <div style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
      <div style="background:#15803d;height:4px;"></div>
      <div style="padding:32px;">
        ${content}
      </div>
      <div style="padding:14px 32px;border-top:1px solid #f3f4f6;background:#fafafa;">
        <p style="margin:0;color:#9ca3af;font-size:11px;">
          ${footer}
        </p>
      </div>
    </div>

  </div>
</div>
</body>
</html>`
}

function lotBox(produit: string, quantite_kg: number, date_disponibilite: string, lang: 'fr' | 'es' | 'en' = 'fr') {
  const L = lang === 'es'
    ? { produit: 'Producto', quantite: 'Cantidad',  dispo: 'Disponible el' }
    : lang === 'en'
    ? { produit: 'Product',  quantite: 'Quantity',  dispo: 'Available on' }
    : { produit: 'Produit',  quantite: 'Quantité',  dispo: 'Disponible le' }

  return `
<div style="background:#f9fafb;border-radius:12px;padding:16px;margin:20px 0;">
  <table style="width:100%;border-collapse:collapse;">
    <tr>
      <td style="padding:4px 0;color:#6b7280;font-size:13px;width:42%;">${L.produit}</td>
      <td style="padding:4px 0;color:#111827;font-size:13px;font-weight:600;">${produit}</td>
    </tr>
    <tr>
      <td style="padding:4px 0;color:#6b7280;font-size:13px;">${L.quantite}</td>
      <td style="padding:4px 0;color:#111827;font-size:13px;font-weight:600;">${quantite_kg.toLocaleString(lang === 'es' ? 'es-CO' : 'fr-FR')} kg</td>
    </tr>
    <tr>
      <td style="padding:4px 0;color:#6b7280;font-size:13px;">${L.dispo}</td>
      <td style="padding:4px 0;color:#111827;font-size:13px;font-weight:600;">${dateFmt(date_disponibilite, lang)}</td>
    </tr>
  </table>
</div>`
}

function btn(href: string, label: string, color = '#15803d') {
  return `<a href="${href}" style="display:inline-block;background:${color};color:white;text-decoration:none;padding:11px 22px;border-radius:10px;font-weight:600;font-size:14px;margin-top:8px;">${label} →</a>`
}

// ─── Email 0a : cultivateur ← acuse de recibo inscripción (ESPAGNOL) ─────────

export async function sendEmailConfirmationCultivateur(params: {
  email: string
  fullName: string
}) {
  const html = layout(`
    <h1 style="margin:0 0 6px;font-size:20px;color:#111827;">¡Hemos recibido tu solicitud! 🌱</h1>
    <p style="margin:0 0 20px;color:#374151;font-size:14px;line-height:1.6;">
      Hola <strong>${params.fullName}</strong>,<br><br>
      Muchas gracias por registrarte en <strong>GMC Connect</strong>. Hemos recibido tu solicitud de inscripción como productor y nuestro equipo la está revisando.<br><br>
      Recibirás un correo electrónico en cuanto tu cuenta haya sido validada. El proceso suele tardar menos de 48 horas.
    </p>
    <div style="background:#f0fdf4;border-radius:10px;padding:14px;margin-bottom:24px;border-left:3px solid #15803d;">
      <p style="margin:0;color:#166534;font-size:13px;font-weight:500;">
        ⏳ No se requiere ninguna acción de tu parte por el momento. Te avisaremos por correo cuando tu cuenta esté activa.
      </p>
    </div>
    <p style="margin:0;color:#6b7280;font-size:12px;">
      Si no has realizado esta solicitud, puedes ignorar este mensaje.
    </p>
  `, 'es')

  await resend.emails.send({
    from: FROM,
    to: params.email,
    subject: 'Hemos recibido tu solicitud 🌱 GMC Connect',
    html,
  })
}

// ─── Email 0b : acheteur ← accusé de réception inscription (FR / ES / EN) ────

export async function sendEmailConfirmationAcheteur(params: {
  email: string
  fullName: string
  country?: string | null
}) {
  const lang = countryToLang(params.country)

  const C = {
    fr: {
      subject: 'Nous avons bien reçu votre demande 🌍 GMC Connect',
      h1: 'Nous avons bien reçu votre demande 🌍',
      greet: 'Bonjour',
      body: `Merci de votre inscription sur <strong>GMC Connect</strong>. Nous avons bien reçu votre demande d'accès en tant qu'acheteur et notre équipe va l'examiner dans les meilleurs délais.<br><br>Vous recevrez un email dès que votre compte aura été validé, généralement sous 48h.`,
      box: `⏳ Aucune action n'est requise de votre part. Vous serez notifié par email dès la validation de votre compte.`,
      ignore: `Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.`,
    },
    es: {
      subject: 'Hemos recibido su solicitud 🌍 GMC Connect',
      h1: 'Hemos recibido su solicitud 🌍',
      greet: 'Hola',
      body: `Gracias por registrarse en <strong>GMC Connect</strong>. Su solicitud de acceso como comprador ha sido recibida y nuestro equipo la examinará en los próximos días.<br><br>Recibirá un correo electrónico en cuanto su cuenta sea validada, generalmente en menos de 48 horas.`,
      box: `⏳ No se requiere ninguna acción de su parte. Le notificaremos por correo cuando su cuenta esté activa.`,
      ignore: `Si no ha realizado esta solicitud, puede ignorar este mensaje.`,
    },
    en: {
      subject: 'We have received your request 🌍 GMC Connect',
      h1: 'We have received your request 🌍',
      greet: 'Hello',
      body: `Thank you for registering on <strong>GMC Connect</strong>. Your request for buyer access has been received and our team will review it shortly.<br><br>You will receive an email as soon as your account has been approved, usually within 48 hours.`,
      box: `⏳ No action is required on your part. You will be notified by email once your account is approved.`,
      ignore: `If you did not make this request, you can ignore this email.`,
    },
  }[lang]

  const html = layout(`
    <h1 style="margin:0 0 6px;font-size:20px;color:#111827;">${C.h1}</h1>
    <p style="margin:0 0 20px;color:#374151;font-size:14px;line-height:1.6;">
      ${C.greet} <strong>${params.fullName}</strong>,<br><br>
      ${C.body}
    </p>
    <div style="background:#eff6ff;border-radius:10px;padding:14px;margin-bottom:24px;border-left:3px solid #3b82f6;">
      <p style="margin:0;color:#1d4ed8;font-size:13px;font-weight:500;">
        ${C.box}
      </p>
    </div>
    <p style="margin:0;color:#6b7280;font-size:12px;">
      ${C.ignore}
    </p>
  `, lang)

  await resend.emails.send({
    from: FROM,
    to: params.email,
    subject: C.subject,
    html,
  })
}

// ─── Email 1 : cultivateur ← GMC manifeste son intérêt (ESPAGNOL) ────────────

export async function sendEmailInteretGMC(params: {
  cultivateurEmail: string
  cultivateurNom: string
  produit: string
  quantite_kg: number
  date_disponibilite: string
}) {
  const html = layout(`
    <h1 style="margin:0 0 6px;font-size:20px;color:#111827;">GMC está interesado en tu lote 🌿</h1>
    <p style="margin:0 0 16px;color:#374151;font-size:14px;line-height:1.6;">
      Hola <strong>${params.cultivateurNom}</strong>,<br>
      El equipo de GMC ha manifestado su interés por tu lote. Un representante te contactará directamente para hablar de las condiciones.
    </p>
    ${lotBox(params.produit, params.quantite_kg, params.date_disponibilite, 'es')}
    <div style="background:#eff6ff;border-radius:10px;padding:14px;margin-bottom:24px;border-left:3px solid #3b82f6;">
      <p style="margin:0;color:#1d4ed8;font-size:13px;font-weight:500;">
        📞 No se requiere ninguna acción — GMC te contactará directamente fuera de la aplicación.
      </p>
    </div>
    ${btn(`${APP_URL}/dashboard/cultivateur/offres`, 'Ver mi panel')}
  `, 'es')

  await resend.emails.send({
    from: FROM,
    to: params.cultivateurEmail,
    subject: `GMC Connect — GMC está interesado en tu lote de ${params.produit}`,
    html,
  })
}

// ─── Email 2 : cultivateur ← cuenta aprobada (ESPAGNOL) ──────────────────────

export async function sendEmailCompteApprouveCultivateur(params: {
  email: string
  fullName: string
}) {
  const html = layout(`
    <h1 style="margin:0 0 6px;font-size:20px;color:#111827;">¡Tu cuenta ha sido aprobada! 🎉</h1>
    <p style="margin:0 0 20px;color:#374151;font-size:14px;line-height:1.6;">
      Hola <strong>${params.fullName}</strong>,<br><br>
      Tu cuenta de cultivador en <strong>GMC Connect</strong> ha sido aprobada por el equipo de GMC.
      Ya puedes iniciar sesión y publicar tus lotes de producción.
    </p>
    <div style="background:#f0fdf4;border-radius:10px;padding:14px;margin-bottom:24px;border-left:3px solid #15803d;">
      <p style="margin:0;color:#166534;font-size:13px;font-weight:500;">
        📦 Publica tus lotes directamente desde tu espacio — GMC te contactará si hay interés.
      </p>
    </div>
    ${btn(`${APP_URL}/login`, 'Iniciar sesión en GMC Connect')}
  `, 'es')

  await resend.emails.send({
    from: FROM,
    to: params.email,
    subject: 'GMC Connect — Tu cuenta ha sido aprobada ✓',
    html,
  })
}

// ─── Email 3 : acheteur ← compte approuvé (FR / ES / EN) ────────────────────

export async function sendEmailCompteApprouveAcheteur(params: {
  email: string
  fullName: string
  country?: string | null
}) {
  const lang = countryToLang(params.country)

  const C = {
    fr: {
      subject: 'Votre compte a été approuvé ✓ GMC Connect',
      h1: 'Votre compte a été approuvé ! 🎉',
      greet: 'Bonjour',
      body: `Votre compte acheteur sur <strong>GMC Connect</strong> a été approuvé par l'équipe GMC. Vous pouvez maintenant accéder au catalogue GMC.`,
      box: `🛒 Consultez les disponibilités et contactez votre interlocuteur GMC pour toute négociation.`,
      btnLabel: 'Accéder au catalogue',
    },
    es: {
      subject: 'Su cuenta ha sido aprobada ✓ GMC Connect',
      h1: '¡Su cuenta ha sido aprobada! 🎉',
      greet: 'Hola',
      body: `Su cuenta de comprador en <strong>GMC Connect</strong> ha sido aprobada por el equipo de GMC. Ya puede acceder al catálogo de GMC.`,
      box: `🛒 Consulte las disponibilidades y contacte a su interlocutor de GMC para cualquier negociación.`,
      btnLabel: 'Acceder al catálogo',
    },
    en: {
      subject: 'Your account has been approved ✓ GMC Connect',
      h1: 'Your account has been approved! 🎉',
      greet: 'Hello',
      body: `Your buyer account on <strong>GMC Connect</strong> has been approved by the GMC team. You can now access the GMC catalog.`,
      box: `🛒 Browse available lots and contact your GMC representative for any negotiation.`,
      btnLabel: 'Access the catalog',
    },
  }[lang]

  const html = layout(`
    <h1 style="margin:0 0 6px;font-size:20px;color:#111827;">${C.h1}</h1>
    <p style="margin:0 0 20px;color:#374151;font-size:14px;line-height:1.6;">
      ${C.greet} <strong>${params.fullName}</strong>,<br><br>
      ${C.body}
    </p>
    <div style="background:#eff6ff;border-radius:10px;padding:14px;margin-bottom:24px;border-left:3px solid #3b82f6;">
      <p style="margin:0;color:#1d4ed8;font-size:13px;font-weight:500;">
        ${C.box}
      </p>
    </div>
    ${btn(`${APP_URL}/login`, C.btnLabel)}
  `, lang)

  await resend.emails.send({
    from: FROM,
    to: params.email,
    subject: C.subject,
    html,
  })
}

// ─── Email 5 : GMC ← intérêt acheteur sur un lot (FRANÇAIS, interne) ────────

export async function sendEmailInteretAcheteur(params: {
  codeLot: string
  produit: string
  quantite_kg: number
  date_disponibilite: string
  acheteurNom: string
  acheteurSociete?: string | null
  acheteurEmail: string
  acheteurPays?: string | null
}) {
  const gmcEmail = process.env.GMC_ADMIN_EMAIL
  if (!gmcEmail) return

  const html = layout(`
    <h1 style="margin:0 0 6px;font-size:20px;color:#111827;">Un acheteur est intéressé 🌿</h1>
    <p style="margin:0 0 20px;color:#374151;font-size:14px;line-height:1.6;">
      Un acheteur a manifesté son intérêt pour un lot du catalogue. Contactez-le directement pour discuter des conditions.
    </p>

    <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Lot concerné</p>
    <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:20px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:13px;width:42%;">Référence</td>
          <td style="padding:4px 0;color:#111827;font-size:13px;font-weight:700;">${params.codeLot}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:13px;">Produit</td>
          <td style="padding:4px 0;color:#111827;font-size:13px;font-weight:600;">${params.produit}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:13px;">Quantité</td>
          <td style="padding:4px 0;color:#111827;font-size:13px;font-weight:600;">${params.quantite_kg.toLocaleString('fr-FR')} kg</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:13px;">Disponible le</td>
          <td style="padding:4px 0;color:#111827;font-size:13px;font-weight:600;">${dateFmt(params.date_disponibilite, 'fr')}</td>
        </tr>
      </table>
    </div>

    <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Acheteur</p>
    <div style="background:#eff6ff;border-radius:12px;padding:16px;margin-bottom:24px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:4px 0;color:#3b82f6;font-size:13px;width:42%;">Nom</td>
          <td style="padding:4px 0;color:#1e3a8a;font-size:13px;font-weight:600;">${params.acheteurNom}</td>
        </tr>
        ${params.acheteurSociete ? `<tr>
          <td style="padding:4px 0;color:#3b82f6;font-size:13px;">Société</td>
          <td style="padding:4px 0;color:#1e3a8a;font-size:13px;font-weight:600;">${params.acheteurSociete}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:4px 0;color:#3b82f6;font-size:13px;">Email</td>
          <td style="padding:4px 0;color:#1e3a8a;font-size:13px;font-weight:600;">
            <a href="mailto:${params.acheteurEmail}" style="color:#1d4ed8;">${params.acheteurEmail}</a>
          </td>
        </tr>
        ${params.acheteurPays ? `<tr>
          <td style="padding:4px 0;color:#3b82f6;font-size:13px;">Pays</td>
          <td style="padding:4px 0;color:#1e3a8a;font-size:13px;font-weight:600;">${params.acheteurPays}</td>
        </tr>` : ''}
      </table>
    </div>

    ${btn(`mailto:${params.acheteurEmail}`, `Répondre à ${params.acheteurNom}`, '#2563eb')}
  `, 'fr')

  await resend.emails.send({
    from: FROM,
    to: gmcEmail,
    subject: `🌿 Intérêt acheteur — ${params.produit} · ${params.codeLot}`,
    html,
  })
}

// ─── Email 4 : GMC admin ← lot publié au catalogue (FRANÇAIS, interne) ───────

export async function sendEmailLotPublie(params: {
  produit: string
  quantite_kg: number
  date_disponibilite: string
  cultivateurNom: string
}) {
  const gmcEmail = process.env.GMC_ADMIN_EMAIL
  if (!gmcEmail) return

  const html = layout(`
    <h1 style="margin:0 0 6px;font-size:20px;color:#111827;">Lot publié au catalogue acheteurs</h1>
    <p style="margin:0 0 16px;color:#374151;font-size:14px;line-height:1.6;">
      Le lot de <strong>${params.cultivateurNom}</strong> est maintenant visible dans le catalogue acheteurs.
    </p>
    ${lotBox(params.produit, params.quantite_kg, params.date_disponibilite, 'fr')}
    ${btn(`${APP_URL}/admin/lots`, 'Voir les lots dans le dashboard', '#4f46e5')}
  `, 'fr')

  await resend.emails.send({
    from: FROM,
    to: gmcEmail,
    subject: `🛒 Lot publié au catalogue — ${params.produit} · ${params.cultivateurNom}`,
    html,
  })
}
