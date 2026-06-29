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
    <div className={`flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5 ${isPending ? 'opacity-60' : ''}`}>
      <button
        type="button"
        onClick={() => switchTo('es')}
        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
          lang === 'es'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        🇪🇸 ES
      </button>
      <button
        type="button"
        onClick={() => switchTo('fr')}
        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
          lang === 'fr'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        🇫🇷 FR
      </button>
    </div>
  )
}
