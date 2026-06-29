'use client'
import { useTransition } from 'react'
import { marquerTraite } from '@/app/admin/interets/actions'
import { adminT } from '@/lib/i18n/admin'
import type { Lang } from '@/lib/i18n/admin'
import type { InteretAvecDetails } from '@/lib/types'

function formatDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(lang === 'es' ? 'es-CO' : 'fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminInteretCard({ interet, lang }: { interet: InteretAvecDetails; lang: Lang }) {
  const t = adminT[lang]
  const [isPending, startTransition] = useTransition()

  const handleTraite = () => {
    startTransition(async () => {
      try { await marquerTraite(interet.id) } catch { /* ignore */ }
    })
  }

  const isNouveau = interet.statut === 'nouveau'

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 ${isNouveau ? 'border-blue-200' : 'border-gray-100 opacity-75'}`}>

      {/* En-tête : statut + date */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          isNouveau
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'bg-gray-100 text-gray-500 border border-gray-200'
        }`}>
          {isNouveau ? t.cardInteretStatutNouveau : t.cardInteretStatutTraite}
        </span>
        <span className="text-xs text-gray-400">{formatDate(interet.created_at, lang)}</span>
      </div>

      {/* Lot concerné */}
      <div className="mb-4">
        {interet.lots ? (
          <div className="flex flex-wrap gap-4 text-sm">
            <span>
              <span className="text-xs text-gray-400 block mb-0.5">{t.cardInteretProduit}</span>
              <strong className="text-gray-900">{interet.lots.produit}</strong>
            </span>
            <span>
              <span className="text-xs text-gray-400 block mb-0.5">{t.cardInteretQuantite}</span>
              <strong className="text-gray-900">
                {interet.lots.quantite_kg.toLocaleString(lang === 'es' ? 'es-CO' : 'fr-FR')} kg
              </strong>
            </span>
            <span>
              <span className="text-xs text-gray-400 block mb-0.5">{t.cardInteretCode}</span>
              <strong className="text-gray-900 font-mono text-blue-700">{interet.code_anonyme}</strong>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{t.cardInteretCode}</span>
            <span className="font-mono text-sm font-bold text-blue-700">{interet.code_anonyme}</span>
            <span className="text-xs text-gray-300">(lot supprimé)</span>
          </div>
        )}
      </div>

      {/* Séparateur */}
      <div className="border-t border-gray-100 pt-4 mb-4">
        {interet.profiles ? (
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <span className="text-gray-400 text-xs mt-0.5">👤</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{interet.profiles.full_name}</p>
                {interet.profiles.company && (
                  <p className="text-xs text-gray-500">{interet.profiles.company}</p>
                )}
                <p className="text-xs text-gray-400">
                  {[interet.profiles.country, interet.profiles.email].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400">Acheteur introuvable</p>
        )}
      </div>

      {/* Bouton marquer traité */}
      {isNouveau && (
        <button
          onClick={handleTraite}
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-xl transition-colors"
        >
          {isPending ? '…' : t.btnMarquerTraite}
        </button>
      )}
    </div>
  )
}
