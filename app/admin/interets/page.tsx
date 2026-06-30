import Image from 'next/image'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import AdminLangSwitcher from '@/components/AdminLangSwitcher'
import AdminInteretCard from '@/components/AdminInteretCard'
import { adminT } from '@/lib/i18n/admin'
import type { Lang } from '@/lib/i18n/admin'
import type { Profile, InteretAvecDetails } from '@/lib/types'

export default async function AdminInterets() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: adminProfile } = await supabase
    .from('profiles').select('role, full_name').eq('id', user.id).single<Profile>()
  if (adminProfile?.role !== 'admin') redirect('/login')

  const cookieStore = await cookies()
  const lang = (cookieStore.get('gmc-admin-lang')?.value ?? 'es') as Lang
  const t = adminT[lang]

  const { data: interetsRaw } = await supabase
    .from('interets_acheteurs')
    .select(`
      id, lot_id, acheteur_id, code_anonyme, created_at, statut,
      lots!lot_id (produit, quantite_kg, date_disponibilite),
      profiles!acheteur_id (full_name, company, country, email)
    `)
    .order('statut', { ascending: true })
    .order('created_at', { ascending: false })

  const interets = (interetsRaw ?? []) as unknown as InteretAvecDetails[]

  const nouveaux = interets.filter(i => i.statut === 'nouveau').length
  const total    = interets.length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/GMC_logo_final_transparent.png" alt="GMC" width={56} height={56} style={{ objectFit: 'contain', flexShrink: 0 }} />
            <div>
              <p className="text-xs text-gray-500 leading-none">GMC Connect</p>
              <p className="text-sm font-semibold text-gray-900 leading-none mt-0.5">{t.dashboardAdmin}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">{adminProfile.full_name}</span>
            <AdminLangSwitcher lang={lang} />
            <LogoutButton label={t.logout} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/admin" className="hover:text-gray-800 transition-colors">
            {t.lotsDashboard}
          </Link>
          <span className="text-gray-300">›</span>
          <span className="text-gray-900 font-medium">{t.interetsBreadcrumb}</span>
        </div>

        {/* Titre + compteurs */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.interetsH1}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {total === 0
                ? t.interetsVide
                : `${total} demande${total > 1 ? 's' : ''} · ${nouveaux} ${t.interetsBadge}${nouveaux > 1 ? 'x' : ''}`}
            </p>
          </div>
        </div>

        {/* Mini stats */}
        {total > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-8 max-w-xs">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-blue-700">{nouveaux}</p>
              <p className="text-xs text-blue-600 mt-0.5">{t.cardInteretStatutNouveau}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-gray-500">{total - nouveaux}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.cardInteretStatutTraite}</p>
            </div>
          </div>
        )}

        {/* Liste */}
        {interets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-4xl mb-3">📩</p>
            <p className="text-gray-600 font-medium mb-1">{t.interetsVide}</p>
            <p className="text-sm text-gray-400">{t.interetsVideDesc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {interets.map(interet => (
              <AdminInteretCard key={interet.id} interet={interet} lang={lang} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
