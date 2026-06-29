import Image from 'next/image'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import PhotosAcheteur from '@/components/PhotosAcheteur'
import InteretAcheteurButton from '@/components/InteretAcheteurButton'
import VideoLotPlayer from '@/components/VideoLotPlayer'
import AcheteurLangSwitcher from '@/components/AcheteurLangSwitcher'
import { acheteurT } from '@/lib/i18n/acheteur'
import type { AcheteurLang } from '@/lib/i18n/acheteur'
import type { Profile, Lot } from '@/lib/types'

type LotPublic = Pick<Lot, 'id' | 'produit' | 'quantite_kg' | 'date_disponibilite' | 'description' | 'photos' | 'video_url' | 'created_at' | 'vendu_le'>

const PRODUIT_EMOJI: Record<string, string> = {
  // Noms espagnols (actuels)
  'Plátano':           '🍌',
  'Piña':              '🍍',
  'Mango':             '🥭',
  'Papaya':            '🍈',
  'Maracuyá':          '🍊',
  'Pitahaya':          '🐉',
  'Lulo':              '🍋',
  'Tomate de árbol':   '🍅',
  'Uchuva':            '🫐',
  'Guanábana':         '🍃',
  'Café':              '☕',
  'Cacao':             '🍫',
  // Anciens noms bilingues (compatibilité lots existants)
  'Banane / Plátano':  '🍌',
  'Ananas / Piña':     '🍍',
  'Mangue / Mango':    '🥭',
  'Papaye / Papaya':   '🍈',
  'Maracuja':          '🍊',
  'Tomate de arbol':   '🍅',
  'Uchuva (Physalis)': '🫐',
}

export default async function DashboardAcheteur() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single<Profile>()

  if (!profile || profile.status !== 'approved') redirect('/pending')
  if (profile.role !== 'acheteur') redirect('/login')

  const cookieStore = await cookies()
  const lang = (cookieStore.get('gmc-acheteur-lang')?.value ?? 'fr') as AcheteurLang
  const t = acheteurT[lang]

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: lotsRaw } = await supabase
    .from('lots')
    .select('id, produit, quantite_kg, date_disponibilite, description, photos, video_url, created_at, vendu_le')
    .eq('visible_acheteurs', true)
    .or(`vendu_le.is.null,vendu_le.gt.${sevenDaysAgo}`)

  const lots = (lotsRaw ?? []) as LotPublic[]

  // Lots disponibles en premier (par dispo ASC), puis vendus (par dispo ASC)
  lots.sort((a, b) => {
    const aVendu = !!a.vendu_le
    const bVendu = !!b.vendu_le
    if (aVendu !== bVendu) return aVendu ? 1 : -1
    return new Date(a.date_disponibilite).getTime() - new Date(b.date_disponibilite).getTime()
  })

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(t.dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })

  const availableCount = lots.filter(l => !l.vendu_le).length
  const s = availableCount > 1 ? 's' : ''
  const catalogueSousTitre = lots.length === 0
    ? t.catalogueVide
    : `${availableCount} ${t.lotWord}${s} ${t.disponibleAdj}${s} — ${t.origineLabel}`

  return (
    <div className="min-h-screen" style={{ background: '#D9C3A5' }}>
      <header style={{ background: '#14331C' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/GMC_logo_final_transparent.png" alt="GMC" width={64} height={64} style={{ objectFit: 'contain', flexShrink: 0 }} />
            <div>
              <p className="text-xs leading-none" style={{ color: 'rgba(246,239,224,0.6)' }}>GMC Connect</p>
              <p className="text-sm font-semibold leading-none mt-0.5" style={{ color: '#F6EFE0' }}>{t.espaceAcheteur}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:block" style={{ color: 'rgba(246,239,224,0.7)' }}>
              {profile.company ?? profile.full_name}
            </span>
            <AcheteurLangSwitcher lang={lang} />
            <LogoutButton label={t.logout} className="text-sm underline underline-offset-2 transition-colors hover:opacity-80" style={{ color: '#F6EFE0' }} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t.catalogueTitre}</h1>
          <p className="text-gray-500 text-sm mt-1">{catalogueSousTitre}</p>
        </div>

        {/* Bannière info */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-8 flex gap-3 items-start">
          <span className="text-blue-500 text-lg mt-0.5 flex-shrink-0">ℹ️</span>
          <div>
            <p className="text-sm font-medium text-blue-800">{t.bannerTitre}</p>
            <p className="text-base text-blue-600 mt-0.5">{t.bannerTexte}</p>
          </div>
        </div>

        {lots.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-4xl mb-3">🌿</p>
            <p className="text-gray-600 font-medium mb-1">{t.emptyTitre}</p>
            <p className="text-sm text-gray-400">
              {t.emptyTexte1}<br />
              {t.emptyTexte2}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lots.map(lot => {
              const emoji = PRODUIT_EMOJI[lot.produit] ?? '📦'
              const isVendu = !!lot.vendu_le
              return (
                <div key={lot.id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-shadow ${isVendu ? 'opacity-70' : 'hover:shadow-md'}`}>

                  <PhotosAcheteur
                    photos={lot.photos ?? []}
                    produit={lot.produit}
                    emoji={emoji}
                    disponibleLabel={t.disponibleBadge}
                    isVendu={isVendu}
                    venduLabel={t.venduBadge}
                  />

                  <div className="p-5">
                    {!lot.photos?.length && (
                      <div className="flex justify-end mb-2">
                        {isVendu ? (
                          <span className="text-xs bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-full">
                            {t.venduBadge}
                          </span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-700 font-medium px-2.5 py-1 rounded-full">
                            {t.disponibleBadge}
                          </span>
                        )}
                      </div>
                    )}

                    <p className="font-bold text-gray-900 text-base mb-1">{lot.produit}</p>
                    <p className="text-xs text-gray-400 mb-3">{t.origineDisplay}</p>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-gray-400">⚖️</span>
                        <span>
                          <strong className="text-gray-800">
                            {lot.quantite_kg.toLocaleString(t.numLocale)} kg
                          </strong>{' '}
                          {t.kgLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-gray-400">📅</span>
                        <span>{t.dispoLe} <strong className="text-gray-800">{formatDate(lot.date_disponibilite)}</strong></span>
                      </div>
                    </div>

                    {lot.description && (
                      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3 leading-relaxed line-clamp-3">
                        {lot.description}
                      </p>
                    )}

                    {lot.video_url && (
                      <div className="mb-3">
                        <VideoLotPlayer url={lot.video_url} />
                      </div>
                    )}

                    <div className="border-t border-gray-100 pt-3">
                      {isVendu ? (
                        <div className="w-full bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-center">
                          <p className="text-sm font-black text-red-600 tracking-widest">{t.venduBadge}</p>
                        </div>
                      ) : (
                        <InteretAcheteurButton
                          lotId={lot.id}
                          produit={lot.produit}
                          quantite_kg={lot.quantite_kg}
                          date_disponibilite={lot.date_disponibilite}
                          lang={lang}
                        />
                      )}
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
