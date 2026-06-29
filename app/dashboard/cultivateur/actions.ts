'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function mettreAJourICA(ica: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { error } = await supabase
    .from('profiles')
    .update({ ica_certifie: ica })
    .eq('id', user.id)
    .eq('role', 'cultivateur')

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/cultivateur')
}
