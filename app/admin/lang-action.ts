'use server'
import { cookies } from 'next/headers'
import type { Lang } from '@/lib/i18n/admin'

export async function setAdminLang(lang: Lang) {
  const store = await cookies()
  store.set('gmc-admin-lang', lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365 * 10,
    httpOnly: false,
    sameSite: 'lax',
  })
}
