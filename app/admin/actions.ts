'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendEmailCompteApprouveCultivateur, sendEmailCompteApprouveAcheteur } from '@/lib/email'

async function getAdminOrThrow() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Accès refusé')
  return supabase
}

export async function approveUser(userId: string) {
  const supabase = await getAdminOrThrow()

  const { data: profile } = await supabase
    .from('profiles')
    .update({ status: 'approved' })
    .eq('id', userId)
    .select('email, full_name, role, country')
    .single()

  revalidatePath('/admin')

  if (profile?.role === 'cultivateur') {
    sendEmailCompteApprouveCultivateur({ email: profile.email, fullName: profile.full_name }).catch(() => {})
  } else if (profile?.role === 'acheteur') {
    sendEmailCompteApprouveAcheteur({ email: profile.email, fullName: profile.full_name, country: profile.country }).catch(() => {})
  }
}

export async function rejectUser(userId: string, reason: string) {
  const supabase = await getAdminOrThrow()
  await supabase
    .from('profiles')
    .update({ status: 'rejected', rejection_reason: reason || null })
    .eq('id', userId)
  revalidatePath('/admin')
}
