'use client'
import { useState, useTransition } from 'react'
import { envoyerInteret } from '@/app/dashboard/acheteur/actions'
import { acheteurT } from '@/lib/i18n/acheteur'
import type { AcheteurLang } from '@/lib/i18n/acheteur'

interface Props {
  lotId: string
  produit: string
  quantite_kg: number
  date_disponibilite: string
  lang: AcheteurLang
}

export default function InteretAcheteurButton({ lotId, produit, quantite_kg, date_disponibilite, lang }: Props) {
  const t = acheteurT[lang]
  const [isPending, startTransition] = useTransition()
  const [codeLot, setCodeLot] = useState<string | null>(null)
  const [erreur, setErreur] = useState(false)

  const handleClick = () => {
    setErreur(false)
    startTransition(async () => {
      try {
        const result = await envoyerInteret({ lotId, produit, quantite_kg, date_disponibilite })
        setCodeLot(result.codeLot)
      } catch {
        setErreur(true)
      }
    })
  }

  if (codeLot) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center">
        <p className="text-sm font-semibold text-green-700 mb-1">{t.confirmTitre}</p>
        <p className="text-xs text-green-600 leading-relaxed">{t.confirmTexte}</p>
        <p className="text-xs text-green-500 mt-1.5 font-mono">{t.confirmRef} {codeLot}</p>
      </div>
    )
  }

  return (
    <div>
      {erreur && (
        <p className="text-xs text-red-500 text-center mb-2">{t.erreur}</p>
      )}
      <button
        onClick={handleClick}
        disabled={isPending}
        className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
      >
        {isPending ? t.btnEnvoi : t.btnInteret}
      </button>
    </div>
  )
}
