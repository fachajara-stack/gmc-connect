'use server'
import { cookies } from 'next/headers'
import type { AcheteurLang } from '@/lib/i18n/acheteur'

export async function setAcheteurLang(lang: AcheteurLang) {
  const store = await cookies()
  store.set('gmc-acheteur-lang', lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365 * 10,
    httpOnly: false,
    sameSite: 'lax',
  })
}
