'use client'
import { useTransition } from 'react'
import { manifesterInteret, annulerInteret, accepterLot, refuserLot, publierAuxAcheteurs, retirerDesAcheteurs, marquerVendu } from '@/app/admin/lots/actions'
import PhotoGallery from '@/components/PhotoGallery'
import VideoLotPlayer from '@/components/VideoLotPlayer'
import { adminT } from '@/lib/i18n/admin'
import type { Lang } from '@/lib/i18n/admin'
import type { LotAvecCultivateur } from '@/lib/types'

const STATUT_STYLES = {
  en_attente: 'bg-amber-100 text-amber-700 border border-amber-200',
  contacte:   'bg-blue-100 text-blue-700 border border-blue-200',
  accepte:    'bg-green-100 text-green-700 border border-green-200',
  refuse:     'bg-red-100 text-red-700 border border-red-200',
}

function formatDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(lang === 'es' ? 'es-CO' : 'fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function AdminLotCard({ lot, lang }: { lot: LotAvecCultivateur; lang: Lang }) {
  const t = adminT[lang]
  const [isPending, startTransition] = useTransition()

  const run = (fn: () => Promise<void>) => {
    startTransition(async () => { try { await fn() } catch { /* ignore */ } })
  }

  const statutLabels = {
    en_attente: t.lotStatutEnAttente,
    contacte:   t.lotStatutContacte,
    accepte:    t.lotStatutAccepte,
    refuse:     t.lotStatutRefuse,
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

      {/* En-tête : cultivateur + statut */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-0.5">
            {lot.profiles.full_name}
          </p>
          <p className="text-xs text-gray-400">
            {[lot.profiles.ville, lot.profiles.region].filter(Boolean).join(', ')}
          </p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${STATUT_STYLES[lot.statut]}`}>
          {statutLabels[lot.statut]}
        </span>
      </div>

      {/* Infos lot */}
      <p className="font-semibold text-gray-900 mb-2">{lot.produit}</p>
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
        <span>⚖️ <strong className="text-gray-700">{lot.quantite_kg.toLocaleString(lang === 'es' ? 'es-CO' : 'fr-FR')} kg</strong></span>
        <span>📅 <strong className="text-gray-700">{formatDate(lot.date_disponibilite, lang)}</strong></span>
        <span className="text-gray-300">·</span>
        <span>{formatDate(lot.created_at, lang)}</span>
      </div>

      {lot.description && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3 leading-relaxed">
          {lot.description}
        </p>
      )}

      {/* Photos du lot */}
      {lot.photos && lot.photos.length > 0 && (
        <div className="mb-3">
          <PhotoGallery photos={lot.photos} thumbnailSize="md" />
        </div>
      )}

      {/* Vidéo du lot */}
      {lot.video_url && (
        <div className="mb-3">
          <VideoLotPlayer url={lot.video_url} />
        </div>
      )}

      {/* Message intérêt manifesté */}
      {lot.statut === 'contacte' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-3">
          <p className="text-xs font-semibold text-blue-800">
            📞 {t.cardInteretManifeste}
          </p>
        </div>
      )}

      {/* Badge vendu */}
      {lot.vendu_le && (() => {
        const daysLeft = Math.max(0, Math.ceil(
          (new Date(lot.vendu_le).getTime() + 7 * 24 * 60 * 60 * 1000 - Date.now()) / (24 * 60 * 60 * 1000)
        ))
        return (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-3">
            <p className="text-xs font-black text-red-700 mb-0.5">🔴 {t.badgeVendu}</p>
            <p className="text-xs text-red-600">{t.cardVenduInfo.replace('{n}', String(daysLeft))}</p>
          </div>
        )
      })()}

      {/* Badge catalogue acheteurs */}
      {lot.statut === 'accepte' && lot.visible_acheteurs && !lot.vendu_le && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5 mb-3">
          <p className="text-xs font-semibold text-indigo-700">
            {t.cardVisibleCatalogue}
          </p>
        </div>
      )}

      {/* Action : manifester l'intérêt */}
      {lot.statut === 'en_attente' && (
        <button
          onClick={() => run(() => manifesterInteret(lot.id))}
          disabled={isPending}
          className="w-full mt-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-xl transition-colors"
        >
          {isPending ? '…' : t.btnManifesterInteret}
        </button>
      )}

      {/* Actions statut contacte → accepte / refuse */}
      {lot.statut === 'contacte' && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex gap-2">
            <button
              onClick={() => run(() => accepterLot(lot.id))}
              disabled={isPending}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
            >
              {isPending ? '…' : t.btnAccepterLot}
            </button>
            <button
              onClick={() => run(() => refuserLot(lot.id))}
              disabled={isPending}
              className="flex-1 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 text-sm font-semibold py-2 rounded-xl border border-red-200 transition-colors"
            >
              {isPending ? '…' : t.btnRefuserLot}
            </button>
          </div>
          <button
            onClick={() => run(() => annulerInteret(lot.id))}
            disabled={isPending}
            className="w-full text-xs text-gray-400 hover:text-gray-600 py-1.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {isPending ? '…' : t.btnRetirerInteret}
          </button>
        </div>
      )}

      {/* Actions catalogue : publier / retirer / marquer vendu */}
      {lot.statut === 'accepte' && (
        lot.visible_acheteurs ? (
          <div className="flex flex-col gap-2 mt-2">
            {!lot.vendu_le && (
              <button
                onClick={() => run(() => marquerVendu(lot.id))}
                disabled={isPending}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
              >
                {isPending ? '…' : t.btnMarquerVendu}
              </button>
            )}
            <button
              onClick={() => run(() => retirerDesAcheteurs(lot.id))}
              disabled={isPending}
              className="w-full text-xs text-indigo-500 hover:text-indigo-700 py-1.5 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              {isPending ? '…' : t.btnRetirerCatalogue}
            </button>
          </div>
        ) : (
          <button
            onClick={() => run(() => publierAuxAcheteurs(lot.id))}
            disabled={isPending}
            className="w-full mt-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-xl transition-colors"
          >
            {isPending ? '…' : t.btnPublierAcheteurs}
          </button>
        )
      )}
    </div>
  )
}
