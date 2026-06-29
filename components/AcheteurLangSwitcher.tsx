'use client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { setAcheteurLang } from '@/app/dashboard/acheteur/lang-action'
import type { AcheteurLang } from '@/lib/i18n/acheteur'

const LANGS: { value: AcheteurLang; label: string }[] = [
  { value: 'fr', label: '🇫🇷 FR' },
  { value: 'es', label: '🇪🇸 ES' },
  { value: 'en', label: '🇬🇧 EN' },
]

export default function AcheteurLangSwitcher({ lang }: { lang: AcheteurLang }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const switchTo = (next: AcheteurLang) => {
    startTransition(async () => {
      await setAcheteurLang(next)
      router.refresh()
    })
  }

  return (
    <div
      className={`flex items-center gap-0.5 rounded-lg p-0.5 ${isPending ? 'opacity-60' : ''}`}
      style={{ background: 'rgba(255,255,255,0.12)' }}
    >
      {LANGS.map(l => (
        <button
          key={l.value}
          type="button"
          onClick={() => switchTo(l.value)}
          className="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
          style={lang === l.value
            ? { background: '#FFD700', color: '#14331C' }
            : { color: 'rgba(246,239,224,0.75)' }
          }
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
