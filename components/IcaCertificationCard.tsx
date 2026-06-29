'use client'
import { useState, useTransition } from 'react'
import { mettreAJourICA } from '@/app/dashboard/cultivateur/actions'

const WA_PHONE = '573116273773'

function buildWhatsAppUrl(fullName: string, region?: string | null, userId?: string): string {
  const ref = userId ? `GMC-${userId.slice(0, 6).toUpperCase()}` : 'GMC'
  const regionPart = region ? ` (Región: ${region})` : ''
  const msg = `Hola GMC, soy ${fullName}${regionPart}. Necesito ayuda con la certificación ICA para exportar mis productos. Ref: ${ref}`
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`
}

type Props = {
  icaCertifie: boolean | null | undefined
  fullName: string
  region?: string | null
  userId?: string
}

export default function IcaCertificationCard({ icaCertifie, fullName, region, userId }: Props) {
  const [valeur, setValeur] = useState<boolean | null | undefined>(icaCertifie)
  const [isPending, startTransition] = useTransition()
  const waUrl = buildWhatsAppUrl(fullName, region, userId)

  const marquer = (ica: boolean) => {
    setValeur(ica) // mise à jour optimiste immédiate — le rendu change sans attendre le serveur
    startTransition(async () => {
      try {
        await mettreAJourICA(ica)
      } catch {
        setValeur(icaCertifie) // revert si erreur serveur
      }
    })
  }

  // Certifié ✓
  if (valeur === true) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-green-600 text-xl">✓</span>
          <div>
            <p className="text-sm font-semibold text-green-800">Certificación ICA confirmada</p>
            <p className="text-xs text-green-600 mt-0.5">Su certificación ICA está registrada para exportación.</p>
          </div>
        </div>
        <button
          onClick={() => marquer(false)}
          disabled={isPending}
          className="text-xs text-green-500 hover:text-green-700 underline underline-offset-2 whitespace-nowrap flex-shrink-0 disabled:opacity-50"
        >
          Modificar
        </button>
      </div>
    )
  }

  // Non certifié — affiche aide + WhatsApp
  if (valeur === false) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-amber-500 text-xl mt-0.5">⚠</span>
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">Certificación ICA requerida</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              La certificación ICA es necesaria para exportar sus productos.
              GMC puede ayudarle a obtenerla y tramitarla. Contáctenos directamente.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contactar GMC por WhatsApp
          </a>
          <button
            onClick={() => marquer(true)}
            disabled={isPending}
            className="text-xs text-amber-600 hover:text-amber-800 border border-amber-300 hover:bg-amber-100 py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {isPending ? '…' : 'Ya tengo la certificación ICA'}
          </button>
        </div>
      </div>
    )
  }

  // Pas encore répondu (null/undefined) — affiche la question
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-gray-400 text-xl mt-0.5">📋</span>
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-0.5">Certificación ICA</p>
          <p className="text-xs text-gray-500">¿Tiene certificación ICA para exportación de frutas?</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => marquer(true)}
          disabled={isPending}
          className="flex-1 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
        >
          {isPending ? '…' : '✓ Sí, tengo ICA'}
        </button>
        <button
          onClick={() => marquer(false)}
          disabled={isPending}
          className="flex-1 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-gray-600 text-sm font-medium py-2.5 rounded-xl transition-colors"
        >
          {isPending ? '…' : 'No tengo ICA'}
        </button>
      </div>
    </div>
  )
}
