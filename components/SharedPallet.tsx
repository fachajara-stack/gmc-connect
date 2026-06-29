import { PieChart, LayoutGrid } from "lucide-react";

type Props = {
  forBuyers: string
  label: string
  h2: string
  p: string
  benefits: [string, string, string, string]
  quote: string
  palette: string
  clients: string
  clientLabel: string
}

export default function SharedPallet({ forBuyers, label, h2, p, benefits, quote, palette, clients, clientLabel }: Props) {
  return (
    <section className="border-y border-gmc-gold/30 bg-gmc-brown py-20 md:py-28 lg:py-[150px]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gmc-gold/50 bg-gmc-gold/10 px-4 py-1.5">
            <span className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: '#FFD700' }}>🛒 {forBuyers}</span>
          </div>
          <span className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.42em] text-gmc-gold">
            <span className="h-px w-7 bg-gradient-to-r from-transparent to-gmc-gold" />
            {label}
          </span>
          <h2 className="mt-2 font-serif text-[clamp(2rem,4.5vw,3.2rem)] font-medium leading-[1.06] text-gmc-cream">
            {h2}
          </h2>
          <p className="mt-5 max-w-[54ch] text-[1.08rem] text-gmc-cream-2">
            {p}
          </p>
          <ul className="mt-7 grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
            {benefits.map((b) => (
              <li key={b} className="relative pl-[26px] text-base text-gmc-cream">
                <span className="absolute left-0 top-px text-[0.82rem] text-gmc-gold">✦</span>
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-7 max-w-[54ch] rounded border border-l-[3px] border-gmc-gold/30 border-l-gmc-gold bg-gmc-gold/[0.08] px-[22px] py-[18px] font-serif text-[1.18rem] italic text-gmc-cream">
            {quote}
          </p>
        </div>
        <div>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-[3px] rounded-[5px] border border-gmc-gold/30 bg-gmc-gold/[0.05] px-1.5 py-4 text-center">
                <PieChart className="h-[18px] w-[18px] text-gmc-gold" strokeWidth={1.6} />
                <b className="font-serif text-[1.05rem] text-gmc-gold-br">100 kg</b>
                <span className="text-[0.56rem] uppercase tracking-[0.14em] text-gmc-taupe">{clientLabel}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-center gap-[22px]">
            <span className="font-serif text-[2.4rem] text-gmc-cream-2">=</span>
            <div className="flex flex-col items-center gap-1 rounded-md border border-gmc-gold bg-gmc-gold/[0.08] px-10 py-[22px] text-center">
              <LayoutGrid className="h-7 w-7 text-gmc-gold" strokeWidth={1.6} />
              <b className="font-serif text-[1.35rem] text-gmc-cream">{palette}</b>
              <span className="text-[0.62rem] uppercase tracking-[0.16em] text-gmc-gold">{clients}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
