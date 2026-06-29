'use server'
import { sendEmailConfirmationCultivateur, sendEmailConfirmationAcheteur } from '@/lib/email'

export async function confirmerInscription(params: {
  email: string
  fullName: string
  role: 'cultivateur' | 'acheteur'
  country?: string | null
}) {
  try {
    if (params.role === 'cultivateur') {
      await sendEmailConfirmationCultivateur({ email: params.email, fullName: params.fullName })
    } else {
      await sendEmailConfirmationAcheteur({ email: params.email, fullName: params.fullName, country: params.country })
    }
  } catch {
    // Email non bloquant — l'inscription reste valide même si Resend échoue
  }
}
