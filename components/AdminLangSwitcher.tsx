'use client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { setAdminLang } from '@/app/admin/lang-action'
import type { Lang } from '@/lib/i18n/admin'

export default function AdminLangSwitcher({ lang }: { lang: Lang }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const switchTo = (next: Lang) => {
    startTransition(async () => {
      await setAdminLang(next)
      router.refresh()
    })
  }

  return (
    <div
      className={`flex items-center gap-0.5 rounded-lg p-0.5 ${isPending ? 'opacity-60' : ''}`}
      style={{ background: 'rgba(255,255,255,0.12)' }}
    >
      <button
        type="button"
        onClick={() => switchTo('es')}
        className="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
        style={lang === 'es' ? { background: '#FFD700', color: '#14331C' } : { color: 'rgba(246,239,224,0.75)' }}
      >
        🇪🇸 ES
      </button>
      <button
        type="button"
        onClick={() => switchTo('fr')}
        className="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
        style={lang === 'fr' ? { background: '#FFD700', color: '#14331C' } : { color: 'rgba(246,239,224,0.75)' }}
      >
        🇫🇷 FR
      </button>
    </div>
  )
}
