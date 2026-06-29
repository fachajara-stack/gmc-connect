'use client'
import { useState, useTransition } from 'react'
import { approveUser, rejectUser } from '@/app/admin/actions'
import { adminT } from '@/lib/i18n/admin'
import type { Lang } from '@/lib/i18n/admin'
import type { Profile } from '@/lib/types'

const STATUS_STYLES: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function AdminUserCard({ profile, lang }: { profile: Profile; lang: Lang }) {
  const t = adminT[lang]
  const [isPending, startTransition] = useTransition()
  const [showReject, setShowReject] = useState(false)
  const [reason, setReason] = useState('')

  const handleApprove = () => startTransition(() => approveUser(profile.id))

  const handleReject = () => {
    if (!showReject) { setShowReject(true); return }
    startTransition(() => {
      rejectUser(profile.id, reason)
      setShowReject(false)
    })
  }

  const roleLabel = profile.role === 'cultivateur'
    ? t.roleCultivateur
    : profile.role === 'acheteur'
      ? t.roleAcheteur
      : t.roleAdmin

  const statusLabel = profile.status === 'pending'
    ? t.statusPending
    : profile.status === 'approved'
      ? t.statusApproved
      : t.statusRejected

  const dateLocale = lang === 'es' ? 'es-CO' : 'fr-FR'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-900">{profile.full_name}</p>
          <p className="text-sm text-gray-500">{profile.email}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[profile.status]}`}>
          {statusLabel}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
        <span className="bg-gray-100 px-2 py-0.5 rounded-full">{roleLabel}</span>
        {profile.region  && <span className="bg-gray-100 px-2 py-0.5 rounded-full">📍 {profile.region}</span>}
        {profile.company && <span className="bg-gray-100 px-2 py-0.5 rounded-full">🏢 {profile.company}</span>}
        {profile.country && <span className="bg-gray-100 px-2 py-0.5 rounded-full">🌍 {profile.country}</span>}
        {profile.role === 'cultivateur' && (
          profile.ica_certifie === true ? (
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ {t.icaCertifie}</span>
          ) : profile.ica_certifie === false ? (
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⚠ {t.icaNonCertifie}</span>
          ) : (
            <span className="bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">{t.icaInconnu}</span>
          )
        )}
        <span className="bg-gray-100 px-2 py-0.5 rounded-full">
          {new Date(profile.created_at).toLocaleDateString(dateLocale)}
        </span>
      </div>

      {profile.description && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-4 line-clamp-2">
          {profile.description}
        </p>
      )}

      {profile.status === 'pending' && (
        <div className="space-y-2">
          {showReject && (
            <input
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={t.raisonRefus}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={handleApprove}
              disabled={isPending}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-xl transition-colors"
            >
              {t.btnApprouver}
            </button>
            <button
              onClick={handleReject}
              disabled={isPending}
              className="flex-1 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 text-sm font-medium py-2 rounded-xl border border-red-200 transition-colors"
            >
              {showReject ? t.btnConfirmerRefus : t.btnRefuser}
            </button>
          </div>
        </div>
      )}

      {profile.status === 'rejected' && profile.rejection_reason && (
        <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
          {t.motifLabel} : {profile.rejection_reason}
        </p>
      )}
    </div>
  )
}
