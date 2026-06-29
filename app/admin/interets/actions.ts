'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function verifierAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Accès refusé')
  return supabase
}

export async function marquerTraite(interetId: string) {
  const supabase = await verifierAdmin()
  const { error } = await supabase
    .from('interets_acheteurs')
    .update({ statut: 'traite' })
    .eq('id', interetId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/interets')
  revalidatePath('/admin')
}
