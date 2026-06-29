'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { confirmerInscription } from '@/app/register/actions'
import PhoneInput from '@/components/PhoneInput'
import LangSwitcher from '@/components/LangSwitcher'
import { readPublicLang, writePublicLang } from '@/lib/i18n/public'

// ─── Traductions ──────────────────────────────────────────────────────────────

type Lang = 'fr' | 'es' | 'en'

const T = {
  fr: {
    titre: 'Inscription Acheteur',
    sousTitre: "Votre demande sera examinée par l'équipe GMC sous 48h.",
    retour: '← Retour',
    nom: 'Nom complet', nomPlaceholder: 'Jean Dupont',
    email: 'Email professionnel', emailPlaceholder: 'jean@entreprise.fr',
    mdp: 'Mot de passe', mdpPlaceholder: 'Minimum 6 caractères',
    entreprise: 'Entreprise', entreprisePlaceholder: 'Nom de votre société',
    pays: 'Pays', paysPlaceholder: 'Sélectionner un pays',
    ville: 'Ville', villePlaceholder: 'Paris',
    tel: 'Téléphone', telPlaceholder: '6 00 00 00 00',
    tva: 'Numéro TVA intracommunautaire', tvaFacultatif: '(facultatif)',
    tvaTip: 'Format attendu : FR 00 000 000 000',
    soumettre: 'Soumettre ma demande', envoi: 'Envoi en cours…',
    dejaInscrit: 'Déjà inscrit ?', seConnecter: 'Se connecter',
  },
  es: {
    titre: 'Inscripción Comprador',
    sousTitre: 'Su solicitud será revisada por el equipo de GMC en 48h.',
    retour: '← Volver',
    nom: 'Nombre completo', nomPlaceholder: 'Juan García',
    email: 'Email profesional', emailPlaceholder: 'juan@empresa.es',
    mdp: 'Contraseña', mdpPlaceholder: 'Mínimo 6 caracteres',
    entreprise: 'Empresa', entreprisePlaceholder: 'Nombre de su empresa',
    pays: 'País', paysPlaceholder: 'Seleccionar un país',
    ville: 'Ciudad', villePlaceholder: 'Madrid',
    tel: 'Teléfono', telPlaceholder: '6 00 00 00 00',
    tva: 'Número IVA intracomunitario', tvaFacultatif: '(opcional)',
    tvaTip: 'Formato esperado : ES A12345678',
    soumettre: 'Enviar mi solicitud', envoi: 'Enviando…',
    dejaInscrit: '¿Ya tiene una cuenta?', seConnecter: 'Iniciar sesión',
  },
  en: {
    titre: 'Buyer Registration',
    sousTitre: 'Your application will be reviewed by the GMC team within 48h.',
    retour: '← Back',
    nom: 'Full name', nomPlaceholder: 'John Smith',
    email: 'Professional email', emailPlaceholder: 'john@company.com',
    mdp: 'Password', mdpPlaceholder: 'Minimum 6 characters',
    entreprise: 'Company', entreprisePlaceholder: 'Your company name',
    pays: 'Country', paysPlaceholder: 'Select a country',
    ville: 'City', villePlaceholder: 'London',
    tel: 'Phone', telPlaceholder: '7 00 00 00 00',
    tva: 'EU VAT number', tvaFacultatif: '(optional)',
    tvaTip: 'Expected format: GB123456789',
    soumettre: 'Submit my application', envoi: 'Submitting…',
    dejaInscrit: 'Already registered?', seConnecter: 'Sign in',
  },
} satisfies Record<Lang, Record<string, string>>

// ─── Pays ─────────────────────────────────────────────────────────────────────

const COUNTRIES: { value: string; fr: string; es: string; en: string }[] = [
  { value: 'Germany',        fr: 'Allemagne',          es: 'Alemania',        en: 'Germany' },
  { value: 'Austria',        fr: 'Autriche',           es: 'Austria',         en: 'Austria' },
  { value: 'Belgium',        fr: 'Belgique',           es: 'Bélgica',         en: 'Belgium' },
  { value: 'Denmark',        fr: 'Danemark',           es: 'Dinamarca',       en: 'Denmark' },
  { value: 'Spain',          fr: 'Espagne',            es: 'España',          en: 'Spain' },
  { value: 'Finland',        fr: 'Finlande',           es: 'Finlandia',       en: 'Finland' },
  { value: 'France',         fr: 'France',             es: 'Francia',         en: 'France' },
  { value: 'Greece',         fr: 'Grèce',              es: 'Grecia',          en: 'Greece' },
  { value: 'Ireland',        fr: 'Irlande',            es: 'Irlanda',         en: 'Ireland' },
  { value: 'Italy',          fr: 'Italie',             es: 'Italia',          en: 'Italy' },
  { value: 'Luxembourg',     fr: 'Luxembourg',         es: 'Luxemburgo',      en: 'Luxembourg' },
  { value: 'Netherlands',    fr: 'Pays-Bas',           es: 'Países Bajos',    en: 'Netherlands' },
  { value: 'Poland',         fr: 'Pologne',            es: 'Polonia',         en: 'Poland' },
  { value: 'Portugal',       fr: 'Portugal',           es: 'Portugal',        en: 'Portugal' },
  { value: 'Czech Republic', fr: 'République Tchèque', es: 'Rep. Checa',      en: 'Czech Republic' },
  { value: 'Romania',        fr: 'Roumanie',           es: 'Rumania',         en: 'Romania' },
  { value: 'Sweden',         fr: 'Suède',              es: 'Suecia',          en: 'Sweden' },
  { value: 'Switzerland',    fr: 'Suisse',             es: 'Suiza',           en: 'Switzerland' },
  { value: 'Other',          fr: 'Autre pays',         es: 'Otro país',       en: 'Other country' },
]

// ─── Composant ────────────────────────────────────────────────────────────────

export default function RegisterAcheteur() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [lang, setLang] = useState<Lang>('fr')
  const [form, setForm] = useState({
    full_name: '', email: '', password: '',
    company: '', country: '', ville: '',
    phone_code: '', phone_number: '',
    vat_number: '',
  })

  useEffect(() => {
    setLang(readPublicLang())
  }, [])

  const changeLang = (l: Lang) => {
    setLang(l)
    writePublicLang(l)
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const phone = form.phone_number.trim()
      ? `${form.phone_code} ${form.phone_number.trim()}`
      : null

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          role: 'acheteur',
          company: form.company || null,
          country: form.country || null,
          ville: form.ville || null,
          phone,
          vat_number: form.vat_number || null,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    await confirmerInscription({ email: form.email, fullName: form.full_name, role: 'acheteur', country: form.country })
    router.push('/pending')
  }

  const t = T[lang]

  const inputCls = 'w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900'

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
              <span className="text-3xl">🛒</span>
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
                  required minLength={6}
                  value={form.password} onChange={set('password')}
                  className={inputCls}
                  style={{ paddingRight: 44 }}
                  placeholder={t.mdpPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.entreprise} *</label>
              <input
                required value={form.company} onChange={set('company')}
                className={inputCls} placeholder={t.entreprisePlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.pays} *</label>
              <select
                required value={form.country} onChange={set('country')}
                className={inputCls}
              >
                <option value="">{t.paysPlaceholder}</option>
                {COUNTRIES.map(c => (
                  <option key={c.value} value={c.value}>{c[lang]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.ville}</label>
              <input
                value={form.ville} onChange={set('ville')}
                className={inputCls} placeholder={t.villePlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.tel}</label>
              <PhoneInput
                dialCode={form.phone_code}
                number={form.phone_number}
                onDialCodeChange={code => setForm(prev => ({ ...prev, phone_code: code }))}
                onNumberChange={num => setForm(prev => ({ ...prev, phone_number: num }))}
                placeholder={t.telPlaceholder}
                accentColor="blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t.tva}
                <span className="ml-1.5 text-xs font-normal text-gray-400">{t.tvaFacultatif}</span>
              </label>
              <input
                value={form.vat_number} onChange={set('vat_number')}
                className={inputCls} placeholder={t.tvaTip}
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
            <Link href="/login" className="font-semibold hover:underline" style={{ color: '#14331C' }}>
              {t.seConnecter}
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
