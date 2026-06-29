import Image from 'next/image'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import NouveauLotForm from '@/components/NouveauLotForm'
import ReponseGMCButtons from '@/components/ReponseGMCButtons'
import PhotoGallery from '@/components/PhotoGallery'
import VideoLotPlayer from '@/components/VideoLotPlayer'
import type { Profile, Lot, LotStatut } from '@/lib/types'

const STATUT_CONFIG: Record<LotStatut, { label: string; style: string }> = {
  en_attente: { label: 'Pendiente',          style: 'bg-amber-100 text-amber-700 border border-amber-200' },
  contacte:   { label: 'Contactado por GMC', style: 'bg-blue-100 text-blue-700 border border-blue-200' },
  accepte:    { label: 'Aceptado',           style: 'bg-green-100 text-green-700 border border-green-200' },
  refuse:     { label: 'Rechazado',          style: 'bg-red-100 text-red-700 border border-red-200' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDateCourt(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function MisLotes() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single<Profile>()

  if (!profile || profile.status !== 'approved') redirect('/pending')
  if (profile.role !== 'cultivateur') redirect('/login')

  const { data: lotsRaw, error: lotsError } = await supabase
    .from('lots')
    .select('*')
    .eq('cultivateur_id', user.id)
    .order('created_at', { ascending: false })

  if (lotsError) {
    throw new Error(`No se pudieron cargar sus lotes: ${lotsError.message}`)
  }

  const lots = (lotsRaw ?? []) as Lot[]

  const counts = {
    total: lots.length,
    en_attente: lots.filter(l => l.statut === 'en_attente').length,
    contacte: lots.filter(l => l.statut === 'contacte').length,
    accepte: lots.filter(l => l.statut === 'accepte').length,
  }

  return (
    <div className="min-h-screen" style={{ background: '#D9C3A5' }}>
      <header style={{ background: '#14331C' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/GMC_logo_final_transparent.png" alt="GMC" width={64} height={64} style={{ objectFit: 'contain', flexShrink: 0 }} />
            <div>
              <p className="text-xs leading-none" style={{ color: 'rgba(246,239,224,0.6)' }}>GMC Connect</p>
              <p className="text-sm font-semibold leading-none mt-0.5" style={{ color: '#F6EFE0' }}>Espacio del Productor</p>
            </div>
          </div>
          <LogoutButton label="Cerrar sesión" className="text-sm underline underline-offset-2 transition-colors hover:opacity-80" style={{ color: '#F6EFE0' }} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/dashboard/cultivateur" className="hover:text-gray-800 transition-colors">
            Panel
          </Link>
          <span className="text-gray-300">›</span>
          <span className="text-gray-900 font-medium">Mis lotes</span>
        </div>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis lotes 📦</h1>
            <p className="text-sm text-gray-500 mt-1">
              {counts.total === 0
                ? 'Ningún lote publicado por el momento'
                : `${counts.total} lote${counts.total > 1 ? 's' : ''} publicado${counts.total > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {counts.total > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-amber-700">{counts.en_attente}</p>
              <p className="text-xs text-amber-600 mt-0.5">Pendiente</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-blue-700">{counts.contacte}</p>
              <p className="text-xs text-blue-600 mt-0.5">Contactado por GMC</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-green-700">{counts.accepte}</p>
              <p className="text-xs text-green-600 mt-0.5">Aceptado</p>
            </div>
          </div>
        )}

        <NouveauLotForm cultivateurId={user.id} />

        {lots.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-3xl mb-3">📦</p>
            <p className="text-gray-600 font-medium mb-1">Ningún lote publicado</p>
            <p className="text-sm text-gray-400">
              Publique su primer lote haciendo clic en el botón de arriba.<br />
              GMC le contactará directamente si su producción les interesa.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {lots.map(lot => {
              const statut = STATUT_CONFIG[lot.statut]
              return (
                <div key={lot.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 mb-1">{lot.produit}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          ⚖️ <strong className="text-gray-700">{lot.quantite_kg.toLocaleString('es-CO')} kg</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          📅 Disponible el <strong className="text-gray-700">{formatDate(lot.date_disponibilite)}</strong>
                        </span>
                      </div>
                      {lot.description && (
                        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3 leading-relaxed">
                          {lot.description}
                        </p>
                      )}

                      {lot.photos && lot.photos.length > 0 && (
                        <div className="mb-3">
                          <PhotoGallery photos={lot.photos} thumbnailSize="sm" />
                        </div>
                      )}

                      {lot.video_url && (
                        <div className="mb-3">
                          <VideoLotPlayer url={lot.video_url} />
                        </div>
                      )}

                      {lot.statut === 'contacte' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-3">
                          <p className="text-xs font-semibold text-blue-800 mb-0.5">
                            📞 GMC ha mostrado interés en este lote.
                          </p>
                          <p className="text-xs text-blue-600">
                            Confirme su disponibilidad o rechace si el lote ya no está disponible.
                          </p>
                          <ReponseGMCButtons lotId={lot.id} />
                        </div>
                      )}

                      {lot.statut === 'accepte' && (
                        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mb-3">
                          <p className="text-xs font-semibold text-green-800">
                            ✓ Ha confirmado su disponibilidad. GMC le contactará para los siguientes pasos.
                          </p>
                        </div>
                      )}

                      {lot.statut === 'refuse' && (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 mb-3">
                          <p className="text-xs text-gray-500">
                            Ha rechazado el interés de GMC en este lote.
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-gray-400">
                        Publicado el {formatDateCourt(lot.created_at)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap ${statut.style}`}>
                        {statut.label}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
