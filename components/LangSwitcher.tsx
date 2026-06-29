'use client'
import type { PublicLang } from '@/lib/i18n/public'

const LANGS: { code: PublicLang; flag: string; label: string }[] = [
  { code: 'es', flag: '🇪🇸', label: 'ES' },
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
]

type Props = {
  lang: PublicLang
  onChange: (l: PublicLang) => void
  variant?: 'light' | 'dark'
}

export default function LangSwitcher({ lang, onChange, variant = 'light' }: Props) {
  if (variant === 'dark') {
    return (
      <div
        className="inline-flex items-center gap-0.5 rounded-full p-1"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,215,0,0.30)',
        }}
      >
        {LANGS.map(({ code, flag, label }) => {
          const active = lang === code
          return (
            <button
              key={code}
              type="button"
              onClick={() => onChange(code)}
              className="rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200"
              style={
                active
                  ? { background: '#FFD700', color: '#14331C' }
                  : { color: '#E8DCC4' }
              }
            >
              {flag} {label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full p-1"
      style={{
        background: 'rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      {LANGS.map(({ code, flag, label }) => {
        const active = lang === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            className="rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200"
            style={
              active
                ? { background: '#14331C', color: '#F6EFE0' }
                : { color: '#6b7280' }
            }
          >
            {flag} {label}
          </button>
        )
      })}
    </div>
  )
}
