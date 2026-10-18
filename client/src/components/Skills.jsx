import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { skills } from '../data/content'
import { Layers, Brain } from './icons'

gsap.registerPlugin(ScrollTrigger)

/* Drawn from the skill items below — no invented tooling. */
const stack = [
  'React',
  'Next.js',
  'Node.js',
  'Express',
  'MongoDB',
  'TypeScript',
  'Python',
  'Pandas',
  'scikit-learn',
  'TensorFlow',
  'PyTorch',
  'SQL',
]

const icons = [Layers, Brain]

function ServiceCard({ group, index }) {
  const Icon = icons[index]
  return (
    <div className="service-card flex h-full flex-col rounded-[26px] border border-line bg-white p-6 shadow-soft">
      <span className="icon-chip">
        <Icon />
      </span>
      <h3 className="mt-5 font-display text-[22px] tracking-tightest text-ink-900">{group.title}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-ink-500">{group.note}</p>

      <ul className="mt-6 space-y-4 border-t border-line pt-6">
        {group.items.map((s) => (
          <li key={s.name} className="skill-row">
            <div className="mb-2 flex items-baseline justify-between gap-3 text-[14.5px]">
              <span className="text-ink-700">{s.name}</span>
              <span className="text-[12.5px] font-medium text-mint-700">{s.level}</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-surface-tint">
              <div
                className="skill-bar h-full origin-left rounded-full bg-gradient-to-r from-mint-300 to-mint-600"
                data-level={s.level}
                style={{ transform: `scaleX(${s.level / 100})` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Skills() {
  const root = useRef(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.from('.service-card', {
        opacity: 0,
        y: 32,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.service-grid', start: 'top 82%' },
      })
      gsap.utils.toArray('.skill-bar').forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, {
          scaleX: parseInt(el.dataset.level, 10) / 100,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: el, start: 'top 92%' },
        })
      })
      gsap.from('.stack-item', {
        opacity: 0,
        y: 12,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.03,
        scrollTrigger: { trigger: '.stack-grid', start: 'top 88%' },
      })
    },
    { scope: root }
  )

  return (
    <section id="skills" ref={root} className="section-pad bg-surface-soft">
      <div className="shell">
        <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
          {/* ---------- services ---------- */}
          <div className="shell-card lg:col-span-2">
            <div className="rounded-[26px] bg-white p-6 shadow-soft sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">Services</p>
                  <h2 className="mt-3 font-display text-[28px] font-semibold leading-tight tracking-tightest text-ink-900 sm:text-[34px]">
                    What I offer
                  </h2>
                </div>
                <p className="pill">Available for Q4 2026</p>
              </div>

              <div className="service-grid mt-8 grid gap-4 sm:grid-cols-2">
                <ServiceCard group={skills.web} index={0} />
                <ServiceCard group={skills.data} index={1} />
              </div>
            </div>
          </div>

          {/* ---------- stack ---------- */}
          <div className="shell-card">
            <div className="flex h-full flex-col rounded-[26px] bg-white p-6 shadow-soft sm:p-8">
              <h3 className="font-display text-[20px] tracking-tightest text-ink-900">
                Tech I work with
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-500">
                The tools behind every build above — product surface first, then
                the data layer underneath.
              </p>
              <div className="stack-grid my-auto grid grid-cols-2 gap-x-4 gap-y-4 py-7">
                {stack.map((t) => (
                  <span
                    key={t}
                    className="stack-item border-b border-line pb-3 font-display text-[15px] tracking-tightest text-ink-500"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-[13px] text-ink-500">
                Plus GraphQL, WebSockets, Redis, FastAPI and SHAP where the
                project calls for them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
