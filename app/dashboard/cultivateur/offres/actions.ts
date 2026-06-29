'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function verifierCultivateur() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  return { supabase, userId: user.id }
}

export async function accepterInteret(lotId: string) {
  const { supabase, userId } = await verifierCultivateur()
  const { error } = await supabase
    .from('lots')
    .update({ statut: 'accepte' })
    .eq('id', lotId)
    .eq('cultivateur_id', userId)
    .eq('statut', 'contacte')
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/cultivateur/offres')
  revalidatePath('/admin/lots')
}

export async function refuserInteret(lotId: string) {
  const { supabase, userId } = await verifierCultivateur()
  const { error } = await supabase
    .from('lots')
    .update({ statut: 'refuse' })
    .eq('id', lotId)
    .eq('cultivateur_id', userId)
    .eq('statut', 'contacte')
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/cultivateur/offres')
  revalidatePath('/admin/lots')
}
