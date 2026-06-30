'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LangSwitcher from '@/components/LangSwitcher'
import SharedPallet from '@/components/SharedPallet'
import { landingT, readPublicLang, writePublicLang, type PublicLang } from '@/lib/i18n/public'

// ─── Design tokens (hex directs — CSS vars non fiables en inline React style) ─

const GOLD         = '#FFD700'
const GOLD_SOFT    = '#FFE34D'
const GREEN        = '#14331C'   // --vert-foret
const VERT_SAPIN   = '#1c4527'   // --vert-sapin
const BROWN        = '#3A2817'   // --marron-moyen  (sections alternées)
const MARRON_CLAIR = '#4A3520'   // --marron-clair  (cartes)
const MARRON_FONCE = '#20140C'   // --marron-fonce  (footer)
const OFF_WHITE    = '#F6EFE0'   // --creme
const BODY         = '#E8DCC4'   // --creme-doux
const TAUPE        = '#C2B393'   // --taupe
const LISERE_OR    = 'rgba(255,215,0,0.30)'
const WHATSAPP     = '#25D366'

const pf: React.CSSProperties = {
  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
}

const CARD: React.CSSProperties = {
  background: MARRON_CLAIR,
  border: `1px solid ${LISERE_OR}`,
  borderRadius: '16px',
  padding: '24px',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const LINK_CULT  = '/register/cultivateur'
const LINK_BUYER = '/register/acheteur'

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px w-8 flex-shrink-0" style={{ background: 'rgba(255,215,0,0.5)' }} />
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] whitespace-nowrap" style={{ color: GOLD }}>
        {children}
      </p>
      <div className="h-px flex-1" style={{ background: 'rgba(255,215,0,0.2)' }} />
    </div>
  )
}

function GoldRule() {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      <div className="h-px w-14" style={{ background: 'rgba(255,215,0,0.35)' }} />
      <span style={{ color: GOLD, fontSize: 12 }}>✦</span>
      <div className="h-px w-14" style={{ background: 'rgba(255,215,0,0.35)' }} />
    </div>
  )
}

function EqualCtas({ href1, label1, href2, label2 }: {
  href1: string; label1: string; href2: string; label2: string
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto mx-auto">
      <Link
        href={href1}
        className="flex-1 sm:flex-initial sm:min-w-[220px] text-center font-bold text-sm sm:text-base px-6 py-4 rounded-xl transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 shadow-lg"
        style={{ background: GOLD, color: GREEN }}
      >
        🌱 {label1}
      </Link>
      <Link
        href={href2}
        className="flex-1 sm:flex-initial sm:min-w-[220px] text-center font-bold text-sm sm:text-base px-6 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
        style={{ border: `1px solid ${LISERE_OR}`, color: GOLD }}
      >
        🛒 {label2}
      </Link>
    </div>
  )
}

// ─── Landing page ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [lang, setLang] = useState<PublicLang>('es')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setLang(readPublicLang())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          obs.unobserve(e.target)
        }
      }),
      { threshold: 0.07 }
    )
    document.querySelectorAll('[data-fade]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [ready])

  const changeLang = (l: PublicLang) => { setLang(l); writePublicLang(l) }
  const t = landingT[lang]
  if (!ready) return null

  const fruits = t.buyerFruits.split(' · ')

  return (
    <div style={{ backgroundColor: GREEN, color: BODY, fontFamily: "var(--font-inter), 'Inter', sans-serif" }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: 'rgba(20,51,28,0.95)', borderBottom: `1px solid ${LISERE_OR}` }}
      >
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image src="/GMC_logo_final_transparent.png" alt="GMC" width={44} height={44} style={{ objectFit: 'contain', flexShrink: 0 }} />
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-none" style={{ color: OFF_WHITE, ...pf }}>GMC Connect</p>
              <p className="text-[10px] mt-0.5 tracking-widest uppercase" style={{ color: GOLD, opacity: 0.7 }}>
                Colombia → Europa
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <LangSwitcher lang={lang} onChange={changeLang} variant="dark" />
            <Link
              href="/login"
              className="hidden sm:block text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: GOLD, border: `1px solid ${LISERE_OR}` }}
            >
              {t.navLogin}
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: GREEN }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.07]"
            style={{ background: `radial-gradient(circle, ${GOLD}, transparent)`, transform: 'translate(25%, -25%)' }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.04]"
            style={{ background: `radial-gradient(circle, ${GOLD}, transparent)`, transform: 'translate(-30%, 30%)' }} />
        </div>

        <div className="relative max-w-3xl mx-auto px-5 py-20 sm:py-28 text-center">
          {/* Logo hero */}
          <div className="flex justify-center mb-8">
            <Image src="/GMC_logo_final_transparent.png" alt="GMC Connect" width={140} height={140} style={{ objectFit: 'contain' }} priority />
          </div>

          <div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8"
            style={{ border: `1px solid ${LISERE_OR}`, background: 'rgba(255,215,0,0.07)' }}
          >
            <span style={{ color: GOLD, fontSize: 10 }}>✦</span>
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: BODY }}>{t.slogan}</span>
            <span style={{ color: GOLD, fontSize: 10 }}>✦</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold leading-[1.1] mb-5" style={{ ...pf, color: OFF_WHITE }}>
            {t.heroTaglineMain}
            <br />
            <em style={{ color: GOLD_SOFT, fontStyle: 'italic' }}>{t.heroTaglineEm}</em>
          </h1>

          <p className="text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: BODY }}>
            {t.heroSubtitle}
          </p>

          <EqualCtas
            href1={LINK_CULT} label1={t.heroCta1}
            href2={LINK_BUYER} label2={t.heroCta2}
          />

          <div className="flex items-center justify-center gap-4 mt-12 text-sm" style={{ color: TAUPE }}>
            <span>🇨🇴 Colombia</span>
            <span style={{ color: GOLD }}>── ✦ ──→</span>
            <span>🌍 {t.routeWorld}</span>
          </div>
        </div>
      </section>

      {/* ── QUI SOMMES-NOUS ────────────────────────────────────────────────── */}
      <section style={{ background: BROWN }}>
        <div className="max-w-5xl mx-auto px-5 py-20 sm:py-24" data-fade>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>{t.aboutTitle}</SectionLabel>
              <div className="mb-6">
                <p className="text-3xl sm:text-4xl font-bold leading-tight" style={{ ...pf, color: OFF_WHITE }}>
                  {t.aboutSubtitleMain}
                </p>
                <p className="text-xl sm:text-2xl font-bold italic mt-1" style={{ ...pf, color: GOLD_SOFT }}>
                  {t.aboutSubtitleEm}
                </p>
              </div>
              <div className="space-y-4 text-sm leading-relaxed">
                <p className="text-base font-medium" style={{ color: OFF_WHITE }}>{t.aboutText1}</p>
                <p style={{ color: BODY }}>{t.aboutText2}</p>
                <p style={{ color: BODY }}>{t.aboutText3}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: '🌱', label: t.gridColombia },
                { emoji: '✈️', label: t.gridEurope },
                { emoji: '📦', label: t.gridPackaging },
                { emoji: '🚢', label: t.gridWorld },
              ].map(({ emoji, label }, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center py-8 rounded-2xl"
                  data-fade data-fade-d1
                  style={CARD}
                >
                  <div className="text-3xl mb-3">{emoji}</div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: BODY }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ──────────────────────────────────────────────── */}
      <section style={{ background: GREEN }}>
        <div className="max-w-5xl mx-auto px-5 py-20 sm:py-24">
          <div className="text-center mb-14" data-fade>
            <SectionLabel>
              {lang === 'fr' ? 'La plateforme' : lang === 'es' ? 'La plataforma' : 'The platform'}
            </SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ ...pf, color: OFF_WHITE }}>
              {t.howTitleMain}{' '}
              <em style={{ color: GOLD_SOFT, fontStyle: 'italic' }}>{t.howTitleEm}</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { emoji: '🌱', title: t.step1Title, desc: t.step1Desc, num: '01' },
              { emoji: '🚀', title: t.step2Title, desc: t.step2Desc, num: '02' },
              { emoji: '🌍', title: t.step3Title, desc: t.step3Desc, num: '03' },
            ].map(({ emoji, title, desc, num }) => (
              <div key={num} className="relative cursor-default" data-fade style={CARD}>
                <div className="absolute top-4 right-5 text-sm font-black" style={{ ...pf, color: GOLD, opacity: 0.5 }}>{num}</div>
                <div className="text-3xl mb-4">{emoji}</div>
                <p className="font-semibold text-sm mb-2" style={{ color: OFF_WHITE }}>{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: BODY }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRANSPORT ──────────────────────────────────────────────────────── */}
      <section style={{ background: BROWN }}>
        <div className="max-w-5xl mx-auto px-5 py-20 sm:py-24">
          <div className="text-center mb-12" data-fade>
            <SectionLabel>{t.transportSectionLabel}</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ ...pf, color: OFF_WHITE }}>
              {t.transportH2Main}{' '}
              <em style={{ color: GOLD_SOFT, fontStyle: 'italic' }}>{t.transportH2Em}</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <div
              className="relative overflow-hidden rounded-2xl p-7 cursor-default transition-all duration-200 hover:-translate-y-1"
              data-fade
              style={{ background: MARRON_CLAIR, border: `1px solid ${LISERE_OR}` }}
            >
              <div className="absolute -top-8 -right-8 text-[80px] opacity-10 select-none" aria-hidden="true">✈️</div>
              <div className="text-4xl mb-4">✈️</div>
              <p className="text-xl font-bold mb-2" style={{ ...pf, color: OFF_WHITE }}>{t.transport1Title}</p>
              <p className="text-sm" style={{ color: GOLD }}>{t.transport1Sub}</p>
            </div>

            <div
              className="relative overflow-hidden rounded-2xl p-7 cursor-default transition-all duration-200 hover:-translate-y-1"
              data-fade data-fade-d1
              style={{ background: MARRON_CLAIR, border: `1px solid ${LISERE_OR}` }}
            >
              <div className="absolute -top-8 -right-8 text-[80px] opacity-10 select-none" aria-hidden="true">🚢</div>
              <div className="text-4xl mb-4">🚢</div>
              <p className="text-xl font-bold mb-2" style={{ ...pf, color: OFF_WHITE }}>{t.transport2Title}</p>
              <p className="text-sm" style={{ color: GOLD }}>{t.transport2Sub}</p>
            </div>
          </div>

          <p className="text-center text-sm" data-fade style={{ color: TAUPE }}>
            ✦ {t.transportNote} ✦
          </p>
        </div>
      </section>

      {/* ── CULTIVATEURS + ACHETEURS ────────────────────────────────────────── */}
      <section style={{ background: GREEN }}>
        <div className="max-w-5xl mx-auto px-5 py-20 sm:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Cultivateurs */}
            <div
              className="rounded-3xl p-7 flex flex-col relative overflow-hidden"
              data-fade
              style={{ background: VERT_SAPIN, border: `1px solid ${LISERE_OR}` }}
            >
              <div className="absolute -bottom-10 -right-10 text-[100px] opacity-[0.04] select-none" aria-hidden="true">🌱</div>
              <div className="relative">
                <SectionLabel>{t.cultTitle}</SectionLabel>
                <p className="text-xl font-bold italic leading-tight mb-6" style={{ ...pf, color: OFF_WHITE }}>
                  &ldquo;{t.cultSlogan}&rdquo;
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  {[t.cultB1, t.cultB2, t.cultB3].map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: BODY }}>
                      <span style={{ color: GOLD, flexShrink: 0, marginTop: 3 }}>✦</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={LINK_CULT}
                  className="inline-block font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 shadow-md"
                  style={{ background: GOLD, color: GREEN }}
                >
                  🌱 {t.cultCta}
                </Link>
              </div>
            </div>

            {/* Acheteurs */}
            <div
              className="rounded-3xl p-7 flex flex-col"
              data-fade data-fade-d1
              style={{ background: MARRON_CLAIR, border: `1px solid ${LISERE_OR}` }}
            >
              <SectionLabel>{t.buyerTitle}</SectionLabel>
              <p className="text-xl font-bold mb-4" style={{ ...pf, color: OFF_WHITE }}>{t.buyerSubtitle}</p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {fruits.map((fruit, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(255,215,0,0.09)',
                      border: `1px solid ${LISERE_OR}`,
                      color: GOLD_SOFT,
                    }}
                  >
                    {fruit}
                  </span>
                ))}
              </div>

              <ul className="space-y-2 mb-8 flex-1">
                {[t.buyerB1, t.buyerB2, t.buyerB3, t.buyerB4].map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs" style={{ color: BODY }}>
                    <span style={{ color: GOLD, flexShrink: 0, marginTop: 2 }}>✦</span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href={LINK_BUYER}
                className="inline-block font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ border: `1px solid ${LISERE_OR}`, color: GOLD }}
              >
                🛒 {t.buyerCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PALETTE MUTUALISÉE ─────────────────────────────────────────────── */}
      <SharedPallet
        forBuyers={t.sharedForBuyers}
        label={t.sharedLabel}
        h2={t.sharedH2}
        p={t.sharedP}
        benefits={[t.sharedB1, t.sharedB2, t.sharedB3, t.sharedB4]}
        quote={t.sharedQuote}
        palette={t.sharedPalette}
        clients={t.sharedClients}
        clientLabel={t.sharedClientLabel}
        slotQty={t.sharedSlotQty}
      />

      {/* ── POURQUOI GMC ───────────────────────────────────────────────────── */}
      <section style={{ background: BROWN }}>
        <div className="max-w-5xl mx-auto px-5 py-20 sm:py-24">
          <div className="text-center mb-14" data-fade>
            <SectionLabel>
              {lang === 'fr' ? 'Nos avantages' : lang === 'es' ? 'Nuestras ventajas' : 'Our advantages'}
            </SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ ...pf, color: OFF_WHITE }}>
              {t.whyTitleMain}{' '}
              <em style={{ color: GOLD_SOFT, fontStyle: 'italic' }}>{t.whyTitleEm}</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🤝', title: t.adv1Title, desc: t.adv1Desc },
              { icon: '🔍', title: t.adv2Title, desc: t.adv2Desc },
              { icon: '🌿', title: t.adv3Title, desc: t.adv3Desc },
              { icon: '💬', title: t.adv4Title, desc: t.adv4Desc },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="transition-all duration-200 hover:-translate-y-1 cursor-default" data-fade style={CARD}>
                <div className="text-2xl mb-3">{icon}</div>
                <p className="font-semibold text-sm mb-2" style={{ color: OFF_WHITE }}>{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: BODY }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────────────────── */}
      <section style={{ background: GREEN }}>
        <div className="max-w-2xl mx-auto px-5 py-24 text-center" data-fade>
          <GoldRule />
          <h2 className="text-3xl sm:text-5xl font-bold leading-tight mb-4" style={{ ...pf, color: OFF_WHITE }}>
            {t.ctaTitleMain}{' '}
            <em style={{ color: GOLD_SOFT, fontStyle: 'italic' }}>{t.ctaTitleEm}</em>
          </h2>
          <p className="text-sm sm:text-base mb-10 max-w-md mx-auto" style={{ color: BODY }}>{t.ctaSubtitle}</p>
          <EqualCtas
            href1={LINK_CULT} label1={t.ctaBtn1}
            href2={LINK_BUYER} label2={t.ctaBtn2}
          />
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer style={{ background: MARRON_FONCE, borderTop: `1px solid ${LISERE_OR}` }}>
        <div className="max-w-6xl mx-auto px-5 pt-12 pb-8">

          {/* Grille 3 colonnes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">

            {/* Col 1 — Identité */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Image src="/GMC_logo_final_transparent.png" alt="GMC" width={36} height={36} className="flex-shrink-0" style={{ objectFit: 'contain' }} />
                <span className="text-base font-bold" style={{ color: OFF_WHITE, ...pf }}>GMC Connect</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: TAUPE }}>{t.slogan}</p>
              <p className="text-xs" style={{ color: TAUPE }}>
                🇨🇴 Colombia → 🌍 {t.routeWorld}
              </p>
              <p className="text-xs mt-1" style={{ color: TAUPE }}>
                {t.footerWebsite}{' '}
                <a
                  href="https://gmc-colombia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:opacity-80"
                  style={{ color: GOLD }}
                >
                  gmc-colombia.com
                </a>
              </p>
            </div>

            {/* Col 2 — Emails */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: GOLD }}>{t.footerContactTitle}</p>
              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wider mb-0.5" style={{ color: TAUPE }}>{t.footerEmailBuyersLabel}</p>
                  <a
                    href="mailto:export@gmc-colombia.com"
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: OFF_WHITE }}
                  >
                    export@gmc-colombia.com
                  </a>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider mb-0.5" style={{ color: TAUPE }}>{t.footerEmailGeneralLabel}</p>
                  <a
                    href="mailto:contact@gmc-colombia.com"
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: OFF_WHITE }}
                  >
                    contact@gmc-colombia.com
                  </a>
                </div>
              </div>
            </div>

            {/* Col 3 — WhatsApp */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: GOLD }}>WhatsApp</p>
              <a
                href="https://wa.me/573116273773"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 font-semibold text-sm px-5 py-3 rounded-xl transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 w-fit"
                style={{ background: WHATSAPP, color: '#fff' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t.footerWhatsappLabel}
              </a>
              <p className="text-xs" style={{ color: TAUPE }}>+57 311 627 3773</p>
            </div>
          </div>

          {/* Séparateur */}
          <div className="h-px mb-6" style={{ background: LISERE_OR }} />

          {/* Bas de footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <Link href="/login" className="transition-colors hover:text-white" style={{ color: TAUPE }}>
              {t.footerLogin}
            </Link>
            <span style={{ color: TAUPE }}>{t.footerNote}</span>
          </div>

        </div>
      </footer>

    </div>
  )
}
