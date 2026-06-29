import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import IcaCertificationCard from '@/components/IcaCertificationCard'
import type { Profile } from '@/lib/types'

export default async function DashboardCultivateur() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>()

  if (!profile || profile.status !== 'approved') redirect('/pending')
  if (profile.role !== 'cultivateur') redirect('/login')

  const { count: lotsCount } = await supabase
    .from('lots')
    .select('*', { count: 'exact', head: true })
    .eq('cultivateur_id', user.id)

  return (
    <div className="min-h-screen" style={{ background: '#D9C3A5' }}>
      <header style={{ background: '#14331C' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Hola, {profile.full_name} 🌱</h1>
          <p className="text-gray-500 text-sm mt-1">
            {profile.region ? `Región: ${profile.region}` : 'Bienvenido a su espacio de productor'}
          </p>
        </div>

        <IcaCertificationCard
          icaCertifie={profile.ica_certifie}
          fullName={profile.full_name}
          region={profile.region}
          userId={user.id}
        />

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-700 text-lg">✓</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">Cuenta validada por GMC</p>
              <p className="text-xs text-green-700 mt-1 leading-relaxed">
                GMC Connect permite a los productores hacer visible su producción para que GMC la comercialice entre su red de compradores.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/cultivateur/offres"
            className="bg-white rounded-2xl border-2 border-green-200 hover:border-green-400 hover:shadow-md p-5 transition-all duration-200 relative group"
          >
            <span className="text-2xl mb-3 block">📦</span>
            <p className="font-semibold text-gray-800 text-sm">Mis lotes</p>
            <p className="text-xs text-gray-500 mt-1">Publique y siga sus lotes de frutas</p>
            {lotsCount !== null && lotsCount > 0 && (
              <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {lotsCount}
              </span>
            )}
            <span className="absolute bottom-3 right-3 text-green-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              Abrir →
            </span>
          </Link>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 opacity-50 relative overflow-hidden">
            <span className="text-2xl mb-3 block">📋</span>
            <p className="font-semibold text-gray-800 text-sm">Mis pedidos</p>
            <p className="text-xs text-gray-500 mt-1">Siga el estado de sus envíos</p>
            <span className="absolute top-3 right-3 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">Pronto</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 opacity-50 relative overflow-hidden">
            <span className="text-2xl mb-3 block">💬</span>
            <p className="font-semibold text-gray-800 text-sm">Mensajes GMC</p>
            <p className="text-xs text-gray-500 mt-1">Comuníquese con su contacto de GMC</p>
            <span className="absolute top-3 right-3 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">Pronto</span>
          </div>
        </div>
      </main>
    </div>
  )
}
