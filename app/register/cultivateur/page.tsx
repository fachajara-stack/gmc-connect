'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { confirmerInscription } from '@/app/register/actions'
import PhoneInput from '@/components/PhoneInput'
import LangSwitcher from '@/components/LangSwitcher'
import { registerCultivT, readPublicLang, writePublicLang, type PublicLang } from '@/lib/i18n/public'

const DEPARTEMENTS_COLOMBIE = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar',
  'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
  'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
  'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
  'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
  'Valle del Cauca', 'Vaupés', 'Vichada',
]

const PRODUITS_BASE = [
  'Plátano', 'Banano Cavendish', 'Mango Baby', 'Mango Keitt', 'Mango Tommy',
  'Maracuyá', 'Guanábana', 'Tomate de árbol', 'Piña', 'Papaya',
  'Uchuva', 'Café', 'Mangostino', 'Aguacate Hass', 'Aguacate Papelillo',
]

const inputCls = 'w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900'

export default function RegisterCultivateur() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [produits, setProduits] = useState<string[]>([])
  const [lang, setLang] = useState<PublicLang>('es')
  const [ready, setReady] = useState(false)
  const [form, setForm] = useState({
    full_name: '', email: '', password: '',
    phone_code: '+57', phone_number: '', region: '', ville: '', description: '',
  })

  useEffect(() => {
    setLang(readPublicLang())
    setReady(true)
  }, [])

  const changeLang = (l: PublicLang) => {
    setLang(l)
    writePublicLang(l)
  }

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const t = registerCultivT[lang]
  const PRODUITS_DISPONIBLES = [...PRODUITS_BASE, t.autresProduit]

  const toggleProduit = (p: string) =>
    setProduits(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.full_name,
            role: 'cultivateur',
            phone: form.phone_number.trim() ? `${form.phone_code} ${form.phone_number.trim()}` : null,
            region: form.region || null,
            ville: form.ville || null,
            produits: produits.length > 0 ? produits.join(', ') : null,
            description: form.description || null,
          },
        },
      })

      if (signUpError) {
        const parts = [
          signUpError.message ? `${signUpError.message}` : null,
          (signUpError as { status?: number }).status != null
            ? `(HTTP ${(signUpError as { status?: number }).status})`
            : null,
          (signUpError as { code?: string }).code
            ? `[${(signUpError as { code?: string }).code}]`
            : null,
        ].filter(Boolean)
        setError(parts.length ? parts.join(' ') : JSON.stringify(signUpError))
        setLoading(false)
        return
      }

      await confirmerInscription({ email: form.email, fullName: form.full_name, role: 'cultivateur' })
      router.push('/pending')
    } catch (err) {
      setError(`Exception : ${err instanceof Error ? err.message : JSON.stringify(err)}`)
      setLoading(false)
    }
  }

  if (!ready) return null

  return (
    <main
      className="min-h-screen flex items-start justify-center p-4 py-10"
      style={{ backgroundColor: '#14331C' }}
    >
      <div className="w-full max-w-md">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-white"
            style={{ color: 'rgba(245,240,230,0.75)' }}
          >
            {t.retour}
          </Link>
          <LangSwitcher lang={lang} onChange={changeLang} variant="dark" />
        </div>

        {/* Carte blanche avec bordure dorée */}
        <div
          className="bg-white rounded-2xl p-8 shadow-xl"
          style={{ border: '2px solid #FFD700' }}
        >
          {/* Header */}
          <div className="mb-7">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🌱</span>
              <h1 className="text-xl font-bold text-gray-900">{t.titre}</h1>
            </div>
            <p className="text-sm text-gray-500">{t.sousTitre}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.nom} *</label>
              <input
                required value={form.full_name} onChange={set('full_name')}
                className={inputCls} placeholder={t.nomPlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.email} *</label>
              <input
                type="email" required value={form.email} onChange={set('email')}
                className={inputCls} placeholder={t.emailPlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.mdp} *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required minLength={6} value={form.password} onChange={set('password')}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.telephone}</label>
              <PhoneInput
                dialCode={form.phone_code}
                number={form.phone_number}
                onDialCodeChange={code => setForm(prev => ({ ...prev, phone_code: code }))}
                onNumberChange={num => setForm(prev => ({ ...prev, phone_number: num }))}
                placeholder={t.telPlaceholder}
                accentColor="green"
                searchPlaceholder={lang === 'es' ? 'Buscar país o indicativo…' : lang === 'fr' ? 'Rechercher un pays ou indicatif…' : 'Search country or +code…'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.departement}</label>
              <select
                value={form.region} onChange={set('region')}
                className={inputCls}
              >
                <option value="">{t.departementPlaceholder}</option>
                {DEPARTEMENTS_COLOMBIE.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.ville}</label>
              <input
                value={form.ville} onChange={set('ville')}
                className={inputCls} placeholder={t.villePlaceholder}
              />
            </div>

            {/* Cases à cocher produits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.produits}</label>
              <div className="grid grid-cols-2 gap-2">
                {PRODUITS_DISPONIBLES.map(p => (
                  <label
                    key={p}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer text-sm transition-colors ${
                      produits.includes(p)
                        ? 'border-green-500 bg-green-50 text-green-800 font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-green-600"
                      checked={produits.includes(p)}
                      onChange={() => toggleProduit(p)}
                    />
                    <span className="leading-tight">{p}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.description}</label>
              <textarea
                rows={3} value={form.description} onChange={set('description')}
                placeholder={t.descriptionPlaceholder}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
              style={{ backgroundColor: '#25d366', color: '#ffffff' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1ebe5d' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#25d366' }}
            >
              {loading ? t.envoi : t.soumettre}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            {t.dejaInscrit}{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--vert-foret)' }}>
              {t.seConnecter}
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
