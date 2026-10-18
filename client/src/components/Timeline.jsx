import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { timeline, profile } from '../data/content'
import { ArrowUpRight } from './icons'

gsap.registerPlugin(ScrollTrigger)

export default function Timeline() {
  const root = useRef(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      /* A brief reveal keeps the rail off the continuous scroll loop. */
      gsap.fromTo(
        '.tl-progress',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.tl-track',
            start: 'top 75%',
            once: true,
          },
        }
      )
      gsap.utils.toArray('.tl-item').forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          y: 28,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 85%' },
        })
      })
    },
    { scope: root }
  )

  return (
    <section id="experience" ref={root} className="section-pad bg-surface-soft">
      <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">Experience</p>
          <h2 className="mt-4 font-display text-[30px] font-semibold leading-tight tracking-tightest text-ink-900 sm:text-[36px]">
            The route so far.
          </h2>
          <p className="mt-5 max-w-[38ch] leading-relaxed text-ink-500">
            A CS thesis on time-series problems, then six years of shipping the
            platforms and the models on top of them.
          </p>
          <a href={`mailto:${profile.email}`} className="btn btn-primary group mt-8">
            Start a project
            <span className="btn-icon">
              <ArrowUpRight />
            </span>
          </a>
        </div>

        <ol className="tl-track relative">
          <span
            className="absolute bottom-6 left-[22px] top-4 w-px border-l border-dashed border-mint-200"
            aria-hidden="true"
          />
          <span
            className="tl-progress absolute bottom-6 left-[22px] top-4 w-px origin-top bg-mint-400"
            aria-hidden="true"
          />

          {timeline.map((t, i) => (
            <li key={t.period} className="tl-item relative flex gap-5 pb-5 last:pb-0 sm:gap-7">
              <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-[14px] border border-line bg-white font-display text-[15px] tracking-tightest text-mint-700 shadow-soft">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="card flex-1 p-6">
                <p className="text-[13px] font-medium text-mint-700">{t.period}</p>
                <h3 className="mt-2 font-display text-[21px] tracking-tightest text-ink-900">
                  {t.role}
                </h3>
                <p className="mt-1 text-[13.5px] text-ink-500">{t.org}</p>
                <p className="mt-4 leading-relaxed text-ink-600">{t.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
