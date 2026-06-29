import Image from 'next/image'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import AdminUserCard from '@/components/AdminUserCard'
import AdminLangSwitcher from '@/components/AdminLangSwitcher'
import { adminT } from '@/lib/i18n/admin'
import type { Lang, AdminTranslations } from '@/lib/i18n/admin'
import type { Profile } from '@/lib/types'

function StatsBar({ profiles, t }: { profiles: Profile[]; t: AdminTranslations }) {
  const pending  = profiles.filter(p => p.status === 'pending').length
  const approved = profiles.filter(p => p.status === 'approved').length
  const rejected = profiles.filter(p => p.status === 'rejected').length
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
        <p className="text-2xl font-bold text-amber-700">{pending}</p>
        <p className="text-xs text-amber-600 mt-0.5">{t.statEnAttente}</p>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
        <p className="text-2xl font-bold text-green-700">{approved}</p>
        <p className="text-xs text-green-600 mt-0.5">{t.statApprouves}</p>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
        <p className="text-2xl font-bold text-red-700">{rejected}</p>
        <p className="text-xs text-red-600 mt-0.5">{t.statRefuses}</p>
      </div>
    </div>
  )
}

function ProfileSection({
  role,
  profiles,
  lang,
  t,
}: {
  role: 'cultivateur' | 'acheteur'
  profiles: Profile[]
  lang: Lang
  t: AdminTranslations
}) {
  const pending  = profiles.filter(p => p.status === 'pending')
  const approved = profiles.filter(p => p.status === 'approved')
  const rejected = profiles.filter(p => p.status === 'rejected')

  if (profiles.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
        <p className="text-gray-400 text-sm">
          {role === 'cultivateur' ? t.emptyNoCultivateur : t.emptyNoAcheteur}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            {t.subEnAttente} ({pending.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map(p => <AdminUserCard key={p.id} profile={p} lang={lang} />)}
          </div>
        </section>
      )}

      {pending.length === 0 && (
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <span className="text-green-500">✓</span> {t.emptyNoPending}
        </p>
      )}

      {approved.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            {t.subApprouves} ({approved.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {approved.map(p => <AdminUserCard key={p.id} profile={p} lang={lang} />)}
          </div>
        </section>
      )}

      {rejected.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            {t.subRefuses} ({rejected.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rejected.map(p => <AdminUserCard key={p.id} profile={p} lang={lang} />)}
          </div>
        </section>
      )}
    </div>
  )
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single<Profile>()

  if (adminProfile?.role !== 'admin') redirect('/login')

  const cookieStore = await cookies()
  const lang = (cookieStore.get('gmc-admin-lang')?.value ?? 'es') as Lang
  const t = adminT[lang]

  const { count: lotsEnAttente } = await supabase
    .from('lots').select('*', { count: 'exact', head: true }).eq('statut', 'en_attente')

  const { count: interetsNouveaux } = await supabase
    .from('interets_acheteurs').select('*', { count: 'exact', head: true }).eq('statut', 'nouveau')

  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('*')
    .neq('role', 'admin')
    .order('created_at', { ascending: false })

  const profiles    = (allProfiles ?? []) as Profile[]
  const cultivateurs = profiles.filter(p => p.role === 'cultivateur')
  const acheteurs    = profiles.filter(p => p.role === 'acheteur')

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
            <span className="text-sm text-gray-500 hidden sm:block">{adminProfile.full_name}</span>
            <AdminLangSwitcher lang={lang} />
            <LogoutButton label={t.logout} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t.dashboardGMC}</h1>
        </div>

        {/* Navigation modules */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t.youAreHere}</p>
            <p className="font-semibold text-gray-900">{t.gestionComptes}</p>
            <p className="text-xs text-gray-500 mt-1">{t.gestionSubtitle}</p>
          </div>
          <Link
            href="/admin/lots"
            className="bg-white rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-md p-5 transition-all relative"
          >
            <p className="font-semibold text-gray-900">{t.lotsTitle}</p>
            <p className="text-xs text-gray-500 mt-1">{t.lotsSubtitle}</p>
            {lotsEnAttente !== null && lotsEnAttente > 0 && (
              <span className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {lotsEnAttente} {t.lotsBadge}
              </span>
            )}
          </Link>
          <Link
            href="/admin/interets"
            className="bg-white rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-md p-5 transition-all relative"
          >
            <p className="font-semibold text-gray-900">{t.interetsTitle}</p>
            <p className="text-xs text-gray-500 mt-1">{t.interetsSubtitle}</p>
            {interetsNouveaux !== null && interetsNouveaux > 0 && (
              <span className="absolute top-3 right-3 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {interetsNouveaux} {t.interetsBadge}
              </span>
            )}
          </Link>
        </div>

        {/* Section Cultivateurs */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🌱</span>
            <h2 className="text-lg font-semibold text-gray-900">{t.sectionCultivateurs}</h2>
            <span className="text-sm text-gray-400 font-normal">({cultivateurs.length})</span>
          </div>
          <StatsBar profiles={cultivateurs} t={t} />
          <ProfileSection role="cultivateur" profiles={cultivateurs} lang={lang} t={t} />
        </div>

        <hr className="border-gray-200 mb-12" />

        {/* Section Acheteurs */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🛒</span>
            <h2 className="text-lg font-semibold text-gray-900">{t.sectionAcheteurs}</h2>
            <span className="text-sm text-gray-400 font-normal">({acheteurs.length})</span>
          </div>
          <StatsBar profiles={acheteurs} t={t} />
          <ProfileSection role="acheteur" profiles={acheteurs} lang={lang} t={t} />
        </div>
      </main>
    </div>
  )
}
