import { Reveal } from './ui/Reveal'
import { SectionLabel } from './ui/SectionLabel'
import { FAQ_ITEMS } from '@/lib/seo'

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 bg-cream">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-10 md:py-24">
        <div className="mb-10 md:mb-14">
          <SectionLabel>Questions fréquentes</SectionLabel>
          <h2 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">
            Les questions qu&apos;on<br className="hidden md:block" /> me pose souvent
          </h2>
        </div>

        <dl className="divide-y divide-honey/15 border-y border-honey/15">
          {FAQ_ITEMS.map((item, i) => (
            <Reveal key={item.q} delay={i * 60}>
              <div className="py-6">
                <dt className="font-display text-xl text-ink md:text-2xl">{item.q}</dt>
                <dd className="mt-2 font-body text-base leading-relaxed text-ink-soft">
                  {item.a}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
