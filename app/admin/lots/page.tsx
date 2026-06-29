import Image from 'next/image'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import AdminLotCard from '@/components/AdminLotCard'
import AdminLangSwitcher from '@/components/AdminLangSwitcher'
import { adminT } from '@/lib/i18n/admin'
import type { Lang } from '@/lib/i18n/admin'
import type { Profile, LotAvecCultivateur, LotStatut } from '@/lib/types'

export default async function AdminLots() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: adminProfile } = await supabase
    .from('profiles').select('role, full_name').eq('id', user.id).single<Profile>()
  if (adminProfile?.role !== 'admin') redirect('/login')

  const cookieStore = await cookies()
  const lang = (cookieStore.get('gmc-admin-lang')?.value ?? 'es') as Lang
  const t = adminT[lang]

  const { data: lotsRaw, error: lotsError } = await supabase
    .from('lots')
    .select('*, profiles!cultivateur_id(full_name, region, ville)')
    .order('created_at', { ascending: false })

  if (lotsError) throw new Error(`Erreur chargement lots : ${lotsError.message}`)

  const lots = (lotsRaw ?? []) as LotAvecCultivateur[]
  const parStatut = (statut: LotStatut) => lots.filter(l => l.statut === statut)
  const total = lots.length

  const SECTIONS: { statut: LotStatut; label: string; couleur: string }[] = [
    { statut: 'en_attente', label: t.lotSectionEnAttente, couleur: 'text-amber-600' },
    { statut: 'contacte',   label: t.lotSectionContacte,  couleur: 'text-blue-600'  },
    { statut: 'accepte',    label: t.lotSectionAccepte,   couleur: 'text-green-600' },
    { statut: 'refuse',     label: t.lotSectionRefuse,    couleur: 'text-red-500'   },
  ]

  const totalText = total === 0
    ? t.lotsAucunPublie
    : `${total} ${t.lotsWord}${total > 1 ? 's' : ''} ${t.lotsAuTotal}`

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/gmc-logo.jpeg" alt="GMC" width={56} height={56} style={{ objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
            <div>
              <p className="text-xs text-gray-500 leading-none">GMC Connect</p>
              <p className="text-sm font-semibold text-gray-900 leading-none mt-0.5">{t.dashboardAdmin}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">{adminProfile?.full_name}</span>
            <AdminLangSwitcher lang={lang} />
            <LogoutButton label={t.logout} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/admin" className="hover:text-gray-800 transition-colors">{t.lotsDashboard}</Link>
          <span className="text-gray-300">›</span>
          <span className="text-gray-900 font-medium">{t.lotsBreadcrumb}</span>
        </div>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.lotsH1}</h1>
            <p className="text-sm text-gray-500 mt-1">{totalText}</p>
          </div>
        </div>

        {/* Stats */}
        {total > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-10">
            {SECTIONS.map(s => {
              const count = parStatut(s.statut).length
              return (
                <div key={s.statut} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
                  <p className={`text-2xl font-bold ${s.couleur}`}>{count}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              )
            })}
          </div>
        )}

        {total === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-3xl mb-3">📦</p>
            <p className="text-gray-600 font-medium mb-1">{t.lotsAucunPublie}</p>
            <p className="text-sm text-gray-400">{t.lotsAucunDesc}</p>
          </div>
        ) : (
          <div className="space-y-10">
            {SECTIONS.map(s => {
              const lotsSection = parStatut(s.statut)
              if (lotsSection.length === 0) return null
              return (
                <section key={s.statut}>
                  <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className={`text-base font-bold ${s.couleur}`}>{lotsSection.length}</span>
                    {s.label}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lotsSection.map(lot => (
                      <AdminLotCard key={lot.id} lot={lot} lang={lang} />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
