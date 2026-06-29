'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import LangSwitcher from '@/components/LangSwitcher'
import { loginT, readPublicLang, writePublicLang, type PublicLang } from '@/lib/i18n/public'

const inputCls = 'w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [lang, setLang] = useState<PublicLang>('es')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setLang(readPublicLang())
    setReady(true)
  }, [])

  const changeLang = (l: PublicLang) => {
    setLang(l)
    writePublicLang(l)
    setError('')
  }

  const t = loginT[lang]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError || !data.user) {
      setError(t.erreurCredentials)
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile) {
      setError(t.erreurProfil)
      setLoading(false)
      return
    }

    if (profile.status === 'rejected') {
      setError(t.erreurRefuse)
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    if (profile.status === 'pending') { router.push('/pending'); return }
    if (profile.role === 'admin') router.push('/admin')
    else if (profile.role === 'cultivateur') router.push('/dashboard/cultivateur')
    else if (profile.role === 'acheteur') router.push('/dashboard/acheteur')
    else router.push('/')
    router.refresh()
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    setResetSent(true)
    setResetLoading(false)
  }

  if (!ready) return null

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: '#14331C' }}
    >
      <div className="w-full max-w-sm">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-white"
            style={{ color: 'rgba(245,240,230,0.75)' }}
          >
            ← {lang === 'fr' ? 'Accueil' : lang === 'es' ? 'Inicio' : 'Home'}
          </Link>
          <LangSwitcher lang={lang} onChange={changeLang} variant="dark" />
        </div>

        {/* Logo + titre (sur fond vert, texte clair) */}
        <div className="text-center mb-6">
          <Link href="/">
            <Image src="/GMC_logo_final_transparent.png" alt="GMC" width={56} height={56} className="mb-4" style={{ objectFit: 'contain' }} />
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {forgotMode ? t.oublieTitre : t.titre}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(245,240,230,0.7)' }}>
            {forgotMode ? t.oublieSousTitre : t.sousTitre}
          </p>
        </div>

        {/* Carte blanche opaque avec bordure dorée */}
        <div
          className="bg-white rounded-2xl p-8 shadow-xl"
          style={{ border: '2px solid #FFD700' }}
        >

          {/* Formulaire connexion */}
          {!forgotMode && (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.email}</label>
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className={inputCls}
                    placeholder={t.emailPlaceholder}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">{t.mdp}</label>
                    <button
                      type="button"
                      onClick={() => { setForgotMode(true); setResetEmail(email) }}
                      className="text-xs font-medium hover:underline"
                      style={{ color: '#FFD700' }}
                    >
                      {t.oublie}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required value={password} onChange={e => setPassword(e.target.value)}
                      className={inputCls}
                      style={{ paddingRight: 44 }}
                      placeholder={t.mdpPlaceholder}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-bold py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
                  style={{ backgroundColor: '#25d366', color: '#ffffff' }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1ebe5d' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#25d366' }}
                >
                  {loading ? t.btnConnexionEnCours : t.btnConnexion}
                </button>
              </form>
            </>
          )}

          {/* Formulaire mot de passe oublié */}
          {forgotMode && (
            <>
              {resetSent ? (
                <div className="text-center py-4">
                  <p className="text-4xl mb-4">📧</p>
                  <p className="font-semibold text-gray-800 mb-1">{t.emailEnvoye}</p>
                  <p className="text-xs text-gray-500">{t.emailEnvoyeDesc}</p>
                  <button
                    onClick={() => { setForgotMode(false); setResetSent(false) }}
                    className="mt-5 text-sm font-medium hover:underline"
                    style={{ color: '#14331C' }}
                  >
                    {t.retourConnexion}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.votreEmail}</label>
                    <input
                      type="email" required value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                      className={inputCls}
                      placeholder={t.emailPlaceholder}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full font-bold py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                    style={{ backgroundColor: '#25d366', color: '#ffffff' }}
                    onMouseEnter={e => { if (!resetLoading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1ebe5d' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#25d366' }}
                  >
                    {resetLoading ? t.envoi : t.envoyerLien}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotMode(false)}
                    className="w-full text-sm text-gray-500 hover:text-gray-700"
                  >
                    {t.retour}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Lien inscription — sur fond vert, texte clair */}
        <p className="text-center text-sm mt-6" style={{ color: 'rgba(245,240,230,0.7)' }}>
          {t.pasDeCpt}{' '}
          <Link href="/" className="font-semibold hover:underline" style={{ color: '#FFD700' }}>
            {t.sInscrire}
          </Link>
        </p>
      </div>
    </main>
  )
}
