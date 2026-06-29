'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendEmailInteretGMC, sendEmailLotPublie } from '@/lib/email'

async function verifierAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Accès refusé')
  return supabase
}

export async function manifesterInteret(lotId: string) {
  const supabase = await verifierAdmin()

  // Récupère infos lot + cultivateur avant mise à jour
  const { data: lot } = await supabase
    .from('lots')
    .select('produit, quantite_kg, date_disponibilite, cultivateur_id')
    .eq('id', lotId)
    .single()

  const { error } = await supabase
    .from('lots')
    .update({ statut: 'contacte' })
    .eq('id', lotId)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/lots')
  revalidatePath('/dashboard/cultivateur/offres')

  // Email au cultivateur (non bloquant — échec silencieux)
  if (lot) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', lot.cultivateur_id)
      .single()

    if (profile?.email) {
      sendEmailInteretGMC({
        cultivateurEmail: profile.email,
        cultivateurNom: profile.full_name,
        produit: lot.produit,
        quantite_kg: lot.quantite_kg,
        date_disponibilite: lot.date_disponibilite,
      }).catch(() => { /* échec email non bloquant */ })
    }
  }
}

export async function accepterLot(lotId: string) {
  const supabase = await verifierAdmin()
  const { error } = await supabase
    .from('lots')
    .update({ statut: 'accepte' })
    .eq('id', lotId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/lots')
  revalidatePath('/dashboard/cultivateur/offres')
}

export async function refuserLot(lotId: string) {
  const supabase = await verifierAdmin()
  const { error } = await supabase
    .from('lots')
    .update({ statut: 'refuse' })
    .eq('id', lotId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/lots')
  revalidatePath('/dashboard/cultivateur/offres')
}

export async function annulerInteret(lotId: string) {
  const supabase = await verifierAdmin()
  const { error } = await supabase
    .from('lots')
    .update({ statut: 'en_attente' })
    .eq('id', lotId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/lots')
  revalidatePath('/dashboard/cultivateur/offres')
}

export async function publierAuxAcheteurs(lotId: string) {
  const supabase = await verifierAdmin()

  // Récupère infos lot + cultivateur avant mise à jour
  const { data: lot } = await supabase
    .from('lots')
    .select('produit, quantite_kg, date_disponibilite, cultivateur_id')
    .eq('id', lotId)
    .single()

  const { error } = await supabase
    .from('lots')
    .update({ visible_acheteurs: true })
    .eq('id', lotId)
    .eq('statut', 'accepte')
  if (error) throw new Error(error.message)

  revalidatePath('/admin/lots')
  revalidatePath('/dashboard/acheteur')

  // Email à GMC (non bloquant — échec silencieux)
  if (lot) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', lot.cultivateur_id)
      .single()

    sendEmailLotPublie({
      produit: lot.produit,
      quantite_kg: lot.quantite_kg,
      date_disponibilite: lot.date_disponibilite,
      cultivateurNom: profile?.full_name ?? 'Cultivateur',
    }).catch(() => { /* échec email non bloquant */ })
  }
}

export async function retirerDesAcheteurs(lotId: string) {
  const supabase = await verifierAdmin()
  const { error } = await supabase
    .from('lots')
    .update({ visible_acheteurs: false })
    .eq('id', lotId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/lots')
  revalidatePath('/dashboard/acheteur')
}

export async function marquerVendu(lotId: string) {
  const supabase = await verifierAdmin()
  const { error } = await supabase
    .from('lots')
    .update({ vendu_le: new Date().toISOString() })
    .eq('id', lotId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/lots')
  revalidatePath('/dashboard/acheteur')
}
