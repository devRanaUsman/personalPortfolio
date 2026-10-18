import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { splitText, hintWillChange, clearWillChange } from '../hooks/splitText'
import { stats, profile } from '../data/content'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const root = useRef(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const words = splitText(root.current.querySelector('.about-lede'), 'words')
      gsap.from(words, {
        yPercent: 110,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.015,
        scrollTrigger: { trigger: root.current, start: 'top 72%' },
        onStart: () => hintWillChange(words),
        onComplete: () => clearWillChange(words),
      })

      /* Counters. Writing textContent every tick dirties layout on a
         display-size number, so skip the write when the string is unchanged. */
      gsap.utils.toArray('.stat-num').forEach((el) => {
        const target = parseFloat(el.dataset.value)
        const decimals = parseInt(el.dataset.decimals || '0', 10)
        const obj = { v: 0 }
        let printed = null
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
          onUpdate: () => {
            const next = obj.v.toFixed(decimals)
            if (next !== printed) {
              printed = next
              el.textContent = next
            }
          },
        })
      })

      gsap.from('.stat-cell', {
        opacity: 0,
        y: 28,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.stat-tray', start: 'top 88%' },
      })
    },
    { scope: root }
  )

  return (
    <section id="about" ref={root} className="section-pad bg-white pt-4 md:pt-6">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="eyebrow">About</p>
            <h2 className="mt-4 font-display text-[30px] font-semibold leading-tight tracking-tightest text-ink-900 sm:text-[34px]">
              Two disciplines, one pipeline.
            </h2>
            <p className="about-lede mt-6 max-w-[44ch] font-display text-[22px] leading-[1.45] tracking-tightest text-ink-800 sm:text-[26px]">
              Most teams hire two people for this. A web engineer to ship the
              product, and a data scientist to make it smart. I close that gap —
              the model and the interface are designed together.
            </p>
          </div>

          <div className="lg:pt-4">
            <p className="max-w-[46ch] leading-relaxed text-ink-500">
              Based in {profile.location}. Six years across agencies, an
              analytics firm, and independent consulting — always at the seam
              where production software meets applied machine learning.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              {profile.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-arrow"
                >
                  {s.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="stat-tray shell-card mt-14">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="stat-cell rounded-[24px] border border-line bg-white p-6 shadow-soft">
                <p className="font-display text-[38px] leading-none tracking-tightest text-ink-900 sm:text-[44px]">
                  <span className="stat-num" data-value={s.value} data-decimals={s.decimals || 0}>
                    {s.value}
                  </span>
                  <span className="text-mint-500">{s.suffix}</span>
                </p>
                <p className="mt-3 text-[13.5px] leading-snug text-ink-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
