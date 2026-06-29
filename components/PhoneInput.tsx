'use client'
import { useState, useRef, useEffect } from 'react'

export type DialCountry = { flag: string; name: string; code: string }

// Liste mondiale complète — triée alphabétiquement par nom anglais
export const WORLD_DIAL_CODES: DialCountry[] = [
  { flag: '🇦🇫', name: 'Afghanistan', code: '+93' },
  { flag: '🇦🇱', name: 'Albania', code: '+355' },
  { flag: '🇩🇿', name: 'Algeria', code: '+213' },
  { flag: '🇦🇩', name: 'Andorra', code: '+376' },
  { flag: '🇦🇴', name: 'Angola', code: '+244' },
  { flag: '🇦🇬', name: 'Antigua and Barbuda', code: '+1268' },
  { flag: '🇦🇷', name: 'Argentina', code: '+54' },
  { flag: '🇦🇲', name: 'Armenia', code: '+374' },
  { flag: '🇦🇺', name: 'Australia', code: '+61' },
  { flag: '🇦🇹', name: 'Austria', code: '+43' },
  { flag: '🇦🇿', name: 'Azerbaijan', code: '+994' },
  { flag: '🇧🇸', name: 'Bahamas', code: '+1242' },
  { flag: '🇧🇭', name: 'Bahrain', code: '+973' },
  { flag: '🇧🇩', name: 'Bangladesh', code: '+880' },
  { flag: '🇧🇧', name: 'Barbados', code: '+1246' },
  { flag: '🇧🇾', name: 'Belarus', code: '+375' },
  { flag: '🇧🇪', name: 'Belgium', code: '+32' },
  { flag: '🇧🇿', name: 'Belize', code: '+501' },
  { flag: '🇧🇯', name: 'Benin', code: '+229' },
  { flag: '🇧🇹', name: 'Bhutan', code: '+975' },
  { flag: '🇧🇴', name: 'Bolivia', code: '+591' },
  { flag: '🇧🇦', name: 'Bosnia and Herzegovina', code: '+387' },
  { flag: '🇧🇼', name: 'Botswana', code: '+267' },
  { flag: '🇧🇷', name: 'Brazil', code: '+55' },
  { flag: '🇧🇳', name: 'Brunei', code: '+673' },
  { flag: '🇧🇬', name: 'Bulgaria', code: '+359' },
  { flag: '🇧🇫', name: 'Burkina Faso', code: '+226' },
  { flag: '🇧🇮', name: 'Burundi', code: '+257' },
  { flag: '🇨🇻', name: 'Cabo Verde', code: '+238' },
  { flag: '🇰🇭', name: 'Cambodia', code: '+855' },
  { flag: '🇨🇲', name: 'Cameroon', code: '+237' },
  { flag: '🇨🇦', name: 'Canada', code: '+1' },
  { flag: '🇨🇫', name: 'Central African Republic', code: '+236' },
  { flag: '🇹🇩', name: 'Chad', code: '+235' },
  { flag: '🇨🇱', name: 'Chile', code: '+56' },
  { flag: '🇨🇳', name: 'China', code: '+86' },
  { flag: '🇨🇴', name: 'Colombia', code: '+57' },
  { flag: '🇰🇲', name: 'Comoros', code: '+269' },
  { flag: '🇨🇬', name: 'Congo (Brazzaville)', code: '+242' },
  { flag: '🇨🇩', name: 'Congo (Kinshasa)', code: '+243' },
  { flag: '🇨🇷', name: 'Costa Rica', code: '+506' },
  { flag: '🇨🇮', name: "Côte d'Ivoire", code: '+225' },
  { flag: '🇭🇷', name: 'Croatia', code: '+385' },
  { flag: '🇨🇺', name: 'Cuba', code: '+53' },
  { flag: '🇨🇾', name: 'Cyprus', code: '+357' },
  { flag: '🇨🇿', name: 'Czech Republic', code: '+420' },
  { flag: '🇩🇰', name: 'Denmark', code: '+45' },
  { flag: '🇩🇯', name: 'Djibouti', code: '+253' },
  { flag: '🇩🇲', name: 'Dominica', code: '+1767' },
  { flag: '🇩🇴', name: 'Dominican Republic', code: '+1809' },
  { flag: '🇪🇨', name: 'Ecuador', code: '+593' },
  { flag: '🇪🇬', name: 'Egypt', code: '+20' },
  { flag: '🇸🇻', name: 'El Salvador', code: '+503' },
  { flag: '🇬🇶', name: 'Equatorial Guinea', code: '+240' },
  { flag: '🇪🇷', name: 'Eritrea', code: '+291' },
  { flag: '🇪🇪', name: 'Estonia', code: '+372' },
  { flag: '🇸🇿', name: 'Eswatini', code: '+268' },
  { flag: '🇪🇹', name: 'Ethiopia', code: '+251' },
  { flag: '🇫🇯', name: 'Fiji', code: '+679' },
  { flag: '🇫🇮', name: 'Finland', code: '+358' },
  { flag: '🇫🇷', name: 'France', code: '+33' },
  { flag: '🇬🇦', name: 'Gabon', code: '+241' },
  { flag: '🇬🇲', name: 'Gambia', code: '+220' },
  { flag: '🇬🇪', name: 'Georgia', code: '+995' },
  { flag: '🇩🇪', name: 'Germany', code: '+49' },
  { flag: '🇬🇭', name: 'Ghana', code: '+233' },
  { flag: '🇬🇷', name: 'Greece', code: '+30' },
  { flag: '🇬🇩', name: 'Grenada', code: '+1473' },
  { flag: '🇬🇹', name: 'Guatemala', code: '+502' },
  { flag: '🇬🇳', name: 'Guinea', code: '+224' },
  { flag: '🇬🇼', name: 'Guinea-Bissau', code: '+245' },
  { flag: '🇬🇾', name: 'Guyana', code: '+592' },
  { flag: '🇭🇹', name: 'Haiti', code: '+509' },
  { flag: '🇭🇳', name: 'Honduras', code: '+504' },
  { flag: '🇭🇰', name: 'Hong Kong', code: '+852' },
  { flag: '🇭🇺', name: 'Hungary', code: '+36' },
  { flag: '🇮🇸', name: 'Iceland', code: '+354' },
  { flag: '🇮🇳', name: 'India', code: '+91' },
  { flag: '🇮🇩', name: 'Indonesia', code: '+62' },
  { flag: '🇮🇷', name: 'Iran', code: '+98' },
  { flag: '🇮🇶', name: 'Iraq', code: '+964' },
  { flag: '🇮🇪', name: 'Ireland', code: '+353' },
  { flag: '🇮🇱', name: 'Israel', code: '+972' },
  { flag: '🇮🇹', name: 'Italy', code: '+39' },
  { flag: '🇯🇲', name: 'Jamaica', code: '+1876' },
  { flag: '🇯🇵', name: 'Japan', code: '+81' },
  { flag: '🇯🇴', name: 'Jordan', code: '+962' },
  { flag: '🇰🇿', name: 'Kazakhstan', code: '+7' },
  { flag: '🇰🇪', name: 'Kenya', code: '+254' },
  { flag: '🇰🇮', name: 'Kiribati', code: '+686' },
  { flag: '🇽🇰', name: 'Kosovo', code: '+383' },
  { flag: '🇰🇼', name: 'Kuwait', code: '+965' },
  { flag: '🇰🇬', name: 'Kyrgyzstan', code: '+996' },
  { flag: '🇱🇦', name: 'Laos', code: '+856' },
  { flag: '🇱🇻', name: 'Latvia', code: '+371' },
  { flag: '🇱🇧', name: 'Lebanon', code: '+961' },
  { flag: '🇱🇸', name: 'Lesotho', code: '+266' },
  { flag: '🇱🇷', name: 'Liberia', code: '+231' },
  { flag: '🇱🇾', name: 'Libya', code: '+218' },
  { flag: '🇱🇮', name: 'Liechtenstein', code: '+423' },
  { flag: '🇱🇹', name: 'Lithuania', code: '+370' },
  { flag: '🇱🇺', name: 'Luxembourg', code: '+352' },
  { flag: '🇲🇴', name: 'Macau', code: '+853' },
  { flag: '🇲🇬', name: 'Madagascar', code: '+261' },
  { flag: '🇲🇼', name: 'Malawi', code: '+265' },
  { flag: '🇲🇾', name: 'Malaysia', code: '+60' },
  { flag: '🇲🇻', name: 'Maldives', code: '+960' },
  { flag: '🇲🇱', name: 'Mali', code: '+223' },
  { flag: '🇲🇹', name: 'Malta', code: '+356' },
  { flag: '🇲🇭', name: 'Marshall Islands', code: '+692' },
  { flag: '🇲🇷', name: 'Mauritania', code: '+222' },
  { flag: '🇲🇺', name: 'Mauritius', code: '+230' },
  { flag: '🇲🇽', name: 'Mexico', code: '+52' },
  { flag: '🇫🇲', name: 'Micronesia', code: '+691' },
  { flag: '🇲🇩', name: 'Moldova', code: '+373' },
  { flag: '🇲🇨', name: 'Monaco', code: '+377' },
  { flag: '🇲🇳', name: 'Mongolia', code: '+976' },
  { flag: '🇲🇪', name: 'Montenegro', code: '+382' },
  { flag: '🇲🇦', name: 'Morocco', code: '+212' },
  { flag: '🇲🇿', name: 'Mozambique', code: '+258' },
  { flag: '🇲🇲', name: 'Myanmar', code: '+95' },
  { flag: '🇳🇦', name: 'Namibia', code: '+264' },
  { flag: '🇳🇷', name: 'Nauru', code: '+674' },
  { flag: '🇳🇵', name: 'Nepal', code: '+977' },
  { flag: '🇳🇱', name: 'Netherlands', code: '+31' },
  { flag: '🇳🇿', name: 'New Zealand', code: '+64' },
  { flag: '🇳🇮', name: 'Nicaragua', code: '+505' },
  { flag: '🇳🇪', name: 'Niger', code: '+227' },
  { flag: '🇳🇬', name: 'Nigeria', code: '+234' },
  { flag: '🇰🇵', name: 'North Korea', code: '+850' },
  { flag: '🇲🇰', name: 'North Macedonia', code: '+389' },
  { flag: '🇳🇴', name: 'Norway', code: '+47' },
  { flag: '🇴🇲', name: 'Oman', code: '+968' },
  { flag: '🇵🇰', name: 'Pakistan', code: '+92' },
  { flag: '🇵🇼', name: 'Palau', code: '+680' },
  { flag: '🇵🇸', name: 'Palestine', code: '+970' },
  { flag: '🇵🇦', name: 'Panama', code: '+507' },
  { flag: '🇵🇬', name: 'Papua New Guinea', code: '+675' },
  { flag: '🇵🇾', name: 'Paraguay', code: '+595' },
  { flag: '🇵🇪', name: 'Peru', code: '+51' },
  { flag: '🇵🇭', name: 'Philippines', code: '+63' },
  { flag: '🇵🇱', name: 'Poland', code: '+48' },
  { flag: '🇵🇹', name: 'Portugal', code: '+351' },
  { flag: '🇵🇷', name: 'Puerto Rico', code: '+1787' },
  { flag: '🇶🇦', name: 'Qatar', code: '+974' },
  { flag: '🇷🇴', name: 'Romania', code: '+40' },
  { flag: '🇷🇺', name: 'Russia', code: '+7' },
  { flag: '🇷🇼', name: 'Rwanda', code: '+250' },
  { flag: '🇰🇳', name: 'Saint Kitts and Nevis', code: '+1869' },
  { flag: '🇱🇨', name: 'Saint Lucia', code: '+1758' },
  { flag: '🇻🇨', name: 'Saint Vincent and the Grenadines', code: '+1784' },
  { flag: '🇼🇸', name: 'Samoa', code: '+685' },
  { flag: '🇸🇲', name: 'San Marino', code: '+378' },
  { flag: '🇸🇹', name: 'São Tomé and Príncipe', code: '+239' },
  { flag: '🇸🇦', name: 'Saudi Arabia', code: '+966' },
  { flag: '🇸🇳', name: 'Senegal', code: '+221' },
  { flag: '🇷🇸', name: 'Serbia', code: '+381' },
  { flag: '🇸🇨', name: 'Seychelles', code: '+248' },
  { flag: '🇸🇱', name: 'Sierra Leone', code: '+232' },
  { flag: '🇸🇬', name: 'Singapore', code: '+65' },
  { flag: '🇸🇰', name: 'Slovakia', code: '+421' },
  { flag: '🇸🇮', name: 'Slovenia', code: '+386' },
  { flag: '🇸🇧', name: 'Solomon Islands', code: '+677' },
  { flag: '🇸🇴', name: 'Somalia', code: '+252' },
  { flag: '🇿🇦', name: 'South Africa', code: '+27' },
  { flag: '🇰🇷', name: 'South Korea', code: '+82' },
  { flag: '🇸🇸', name: 'South Sudan', code: '+211' },
  { flag: '🇪🇸', name: 'Spain', code: '+34' },
  { flag: '🇱🇰', name: 'Sri Lanka', code: '+94' },
  { flag: '🇸🇩', name: 'Sudan', code: '+249' },
  { flag: '🇸🇷', name: 'Suriname', code: '+597' },
  { flag: '🇸🇪', name: 'Sweden', code: '+46' },
  { flag: '🇨🇭', name: 'Switzerland', code: '+41' },
  { flag: '🇸🇾', name: 'Syria', code: '+963' },
  { flag: '🇹🇼', name: 'Taiwan', code: '+886' },
  { flag: '🇹🇯', name: 'Tajikistan', code: '+992' },
  { flag: '🇹🇿', name: 'Tanzania', code: '+255' },
  { flag: '🇹🇭', name: 'Thailand', code: '+66' },
  { flag: '🇹🇱', name: 'Timor-Leste', code: '+670' },
  { flag: '🇹🇬', name: 'Togo', code: '+228' },
  { flag: '🇹🇴', name: 'Tonga', code: '+676' },
  { flag: '🇹🇹', name: 'Trinidad and Tobago', code: '+1868' },
  { flag: '🇹🇳', name: 'Tunisia', code: '+216' },
  { flag: '🇹🇷', name: 'Turkey', code: '+90' },
  { flag: '🇹🇲', name: 'Turkmenistan', code: '+993' },
  { flag: '🇹🇻', name: 'Tuvalu', code: '+688' },
  { flag: '🇺🇬', name: 'Uganda', code: '+256' },
  { flag: '🇺🇦', name: 'Ukraine', code: '+380' },
  { flag: '🇦🇪', name: 'United Arab Emirates', code: '+971' },
  { flag: '🇬🇧', name: 'United Kingdom', code: '+44' },
  { flag: '🇺🇸', name: 'United States', code: '+1' },
  { flag: '🇺🇾', name: 'Uruguay', code: '+598' },
  { flag: '🇺🇿', name: 'Uzbekistan', code: '+998' },
  { flag: '🇻🇺', name: 'Vanuatu', code: '+678' },
  { flag: '🇻🇦', name: 'Vatican City', code: '+379' },
  { flag: '🇻🇪', name: 'Venezuela', code: '+58' },
  { flag: '🇻🇳', name: 'Vietnam', code: '+84' },
  { flag: '🇾🇪', name: 'Yemen', code: '+967' },
  { flag: '🇿🇲', name: 'Zambia', code: '+260' },
  { flag: '🇿🇼', name: 'Zimbabwe', code: '+263' },
]

type Props = {
  dialCode: string
  number: string
  onDialCodeChange: (code: string) => void
  onNumberChange: (num: string) => void
  placeholder?: string
  accentColor?: 'blue' | 'green'
  searchPlaceholder?: string
}

export default function PhoneInput({
  dialCode,
  number,
  onDialCodeChange,
  onNumberChange,
  placeholder = '000 000 0000',
  accentColor = 'blue',
  searchPlaceholder = 'Search country or +code…',
}: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  // Track selected by name to distinguish same-code countries (e.g. USA vs Canada)
  const [selectedName, setSelectedName] = useState<string>(
    () => WORLD_DIAL_CODES.find(c => c.code === dialCode)?.name ?? ''
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const current = selectedName
    ? WORLD_DIAL_CODES.find(c => c.name === selectedName)
    : WORLD_DIAL_CODES.find(c => c.code === dialCode)

  const query = search.trim().toLowerCase()
  const filtered = query
    ? WORLD_DIAL_CODES.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.code.replace('+', '').includes(query.replace('+', ''))
      )
    : WORLD_DIAL_CODES

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Auto-focus search when dropdown opens; scroll selected into view
  useEffect(() => {
    if (open) {
      searchRef.current?.focus()
      // scroll selected item into view
      requestAnimationFrame(() => {
        const selected = listRef.current?.querySelector('[data-selected="true"]') as HTMLElement | null
        selected?.scrollIntoView({ block: 'nearest' })
      })
    }
  }, [open])

  const select = (country: DialCountry) => {
    setSelectedName(country.name)
    onDialCodeChange(country.code)
    setOpen(false)
    setSearch('')
  }

  const ringCls = accentColor === 'green' ? 'focus-within:ring-green-500' : 'focus-within:ring-blue-500'

  return (
    <div ref={containerRef} className="relative">
      <div className={`flex border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 ${ringCls} focus-within:border-transparent`}>
        {/* Dial code picker button */}
        <button
          type="button"
          onClick={() => { setOpen(v => !v); if (!open) setSearch('') }}
          className="flex items-center gap-1.5 border-r border-gray-200 bg-gray-50 pl-3 pr-2 py-2.5 text-sm hover:bg-gray-100 transition-colors shrink-0"
        >
          <span className="text-base leading-none">{current?.flag ?? '🌐'}</span>
          <span className="font-mono text-gray-700 font-medium text-xs">{dialCode || '—'}</span>
          <span className="text-gray-400 text-[10px]">▾</span>
        </button>
        {/* Number input */}
        <input
          type="tel"
          value={number}
          onChange={e => onNumberChange(e.target.value)}
          className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-white min-w-0"
          placeholder={placeholder}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); setSearch('') } }}
              placeholder={searchPlaceholder}
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Country list */}
          <ul ref={listRef} className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="text-center text-sm text-gray-400 py-4">No results</li>
            ) : (
              filtered.map(c => {
                const isSelected = c.name === selectedName
                return (
                  <li key={c.name}>
                    <button
                      type="button"
                      data-selected={isSelected}
                      onClick={() => select(c)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="text-base shrink-0">{c.flag}</span>
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="text-gray-400 font-mono text-xs shrink-0">{c.code}</span>
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
