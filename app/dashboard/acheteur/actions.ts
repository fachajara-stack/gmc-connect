'use server'
import { createClient } from '@/lib/supabase/server'
import { sendEmailInteretAcheteur } from '@/lib/email'

function gmcCode(lotId: string) {
  return `GMC-${lotId.replace(/-/g, '').slice(0, 6).toUpperCase()}`
}

export async function envoyerInteret(params: {
  lotId: string
  produit: string
  quantite_kg: number
  date_disponibilite: string
}): Promise<{ codeLot: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, company, country, role, status')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'acheteur' || profile?.status !== 'approved') {
    throw new Error('Accès refusé')
  }

  const codeLot = gmcCode(params.lotId)

  // Enregistrement en base (prioritaire — si ça échoue, on throw)
  const { error: insertError } = await supabase
    .from('interets_acheteurs')
    .insert({
      lot_id: params.lotId,
      acheteur_id: user.id,
      code_anonyme: codeLot,
      statut: 'nouveau',
    })

  if (insertError) throw new Error('Erreur lors de l\'enregistrement de la demande')

  // Email à GMC (non bloquant)
  sendEmailInteretAcheteur({
    codeLot,
    produit: params.produit,
    quantite_kg: params.quantite_kg,
    date_disponibilite: params.date_disponibilite,
    acheteurNom: profile.full_name,
    acheteurSociete: profile.company,
    acheteurEmail: profile.email,
    acheteurPays: profile.country,
  }).catch(() => { /* échec email non bloquant */ })

  return { codeLot }
}
