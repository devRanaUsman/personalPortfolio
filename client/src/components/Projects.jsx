import { useRef, useState, useCallback, useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import useTilt from '../hooks/useTilt'
import { projects } from '../data/content'

gsap.registerPlugin(ScrollTrigger)

/* Generated abstract preview art — warm metallic gradients, zero image weight. */
function Artwork({ tone, title }) {
  /* useId keeps the gradient id unique. Previously the card and the open case
     study both emitted `id="g3"`, so the browser had two live definitions
     fighting over the same reference. */
  const uid = useId().replace(/:/g, '')
  const seeds = [
    { a: '#c9a961', b: '#2a2117', r: 34 },
    { a: '#d4af7a', b: '#1c1712', r: 58 },
    { a: '#e8cf9a', b: '#241d13', r: 22 },
    { a: '#a8874a', b: '#171310', r: 66 },
    { a: '#c9a961', b: '#201a11', r: 48 },
    { a: '#d4af7a', b: '#26200f', r: 30 },
  ]
  const s = seeds[tone % seeds.length]
  const id = `g${tone}-${uid}`
  return (
    <svg
      viewBox="0 0 400 260"
      className="w-full h-full"
      role="img"
      aria-label={`${title} preview artwork`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={id} cx={`${20 + s.r}%`} cy="30%" r="90%">
          <stop offset="0%" stopColor={s.a} stopOpacity="0.9" />
          <stop offset="55%" stopColor={s.b} />
          <stop offset="100%" stopColor="#0a0a0a" />
        </radialGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#${id})`} />
      <g stroke={s.a} strokeOpacity="0.25" fill="none">
        {[...Array(7)].map((_, i) => (
          <circle key={i} cx={300 - s.r} cy={80 + s.r / 2} r={18 + i * (14 + (tone % 3) * 4)} />
        ))}
      </g>
      <rect x="24" y="210" width={90 + s.r} height="2" fill={s.a} fillOpacity="0.6" />
    </svg>
  )
}

function Card({ p, onOpen }) {
  const tilt = useTilt(6)
  return (
    <article ref={tilt} className="tilt proj-card group">
      <button
        type="button"
        onClick={() => onOpen(p)}
        data-cursor
        className="block w-full text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-500"
        aria-label={`Open case study: ${p.title}`}
      >
        <div className="tilt-inner relative aspect-[4/3] overflow-hidden bg-ink-800 border border-ink-700 group-hover:border-gold-700 transition-colors duration-500">
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
            <Artwork tone={p.tone} title={p.title} />
          </div>
          {/* Was `backdrop-blur-sm`: a backdrop-filter forces its own render
              surface and a readback of everything behind it. Six of them, each
              inside a 3D-transformed card, is a lot of extra compositing for a
              label. A solid chip looks the same and costs nothing. */}
          <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-bone-300/80 bg-ink-950/85 px-3 py-1.5">
            {p.kind}
          </span>
          <span className="absolute bottom-4 right-4 text-gold-400 text-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            Case study →
          </span>
        </div>
        <div className="tilt-inner mt-5 flex items-baseline justify-between gap-4">
          <h4 className="font-display text-xl md:text-2xl tracking-tightest group-hover:text-gold-300 transition-colors duration-300">
            {p.title}
          </h4>
          <span className="font-mono text-xs text-bone-500">{p.year}</span>
        </div>
        <p className="tilt-inner mt-2 text-sm text-bone-500 leading-relaxed">{p.summary}</p>
      </button>
    </article>
  )
}

function CaseStudy({ project, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!project) return
    window.lenis?.stop()
    window.isProjectModalOpen = true
    window.dispatchEvent(new Event('modal-toggle'))
    document.body.classList.add('modal-open')
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.lenis?.start()
      window.isProjectModalOpen = false
      window.dispatchEvent(new Event('modal-toggle'))
      document.body.classList.remove('modal-open')
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  useGSAP(
    () => {
      if (!project || !ref.current) return
      const el = ref.current
      el.style.willChange = 'transform, opacity'
      gsap.fromTo(
        el,
        { yPercent: 6, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          onComplete: () => {
            el.style.willChange = ''
          },
        }
      )
    },
    { scope: ref, dependencies: [project?.id] }
  )

  if (!project) return null

  /* Rendered into <body> via a portal so it is never affected by the
     containment/stacking context of the Projects section, and so it paints
     above the grain overlay instead of underneath it. */
  return createPortal(
    <div
      /* `backdrop-blur-md` across the full viewport was the single biggest
         cost on this screen: backdrop-filter re-reads and Gaussian-blurs
         every pixel behind the overlay, every frame, and the pixel count
         quadruples going from a half-window to a maximised 1440p display.
         A near-opaque panel gives the same "content recedes" read for free. */
      className="fixed inset-0 z-[110] bg-ink-950/95 overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
      onClick={onClose}
      data-lenis-prevent
    >
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        className="max-w-3xl mx-auto my-16 md:my-24 bg-ink-900 border border-ink-700 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
      >
        <div className="aspect-[16/7] overflow-hidden border-b border-ink-700">
          <Artwork tone={project.tone} title={project.title} />
        </div>
        <div className="p-8 md:p-12">
          <p className="eyebrow">{project.kind} · {project.year}</p>
          <h3 className="mt-4 font-display text-3xl md:text-4xl tracking-tightest">
            {project.title}
          </h3>
          <p className="mt-6 text-bone-300 leading-relaxed">{project.summary}</p>
          <p className="mt-4 text-bone-500 leading-relaxed">{project.detail}</p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li
                key={t}
                className="font-mono text-[11px] uppercase tracking-widest text-gold-400 border border-gold-700/60 px-3 py-1.5"
              >
                {t}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onClose}
            className="mt-10 text-sm uppercase tracking-[0.25em] text-bone-300 hover:text-gold-400 transition-colors"
          >
            ← Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

function Row({ label, items, onOpen }) {
  return (
    <div className="proj-row mt-16 first:mt-0">
      <div className="flex items-center gap-6 mb-10">
        <h3 className="font-display text-xl md:text-2xl tracking-tightest text-bone-300">
          {label}
        </h3>
        <span className="rule flex-1" />
        <span className="font-mono text-xs text-gold-600">{items.length} projects</span>
      </div>
      <div className="grid md:grid-cols-3 gap-8 md:gap-10">
        {items.map((p) => (
          <Card key={p.id} p={p} onOpen={onOpen} />
        ))}
      </div>
    </div>
  )
}

export default function Projects() {
  const root = useRef(null)
  const [active, setActive] = useState(null)
  const open = useCallback((p) => setActive(p), [])
  const close = useCallback(() => setActive(null), [])

  useGSAP(
    () => {
      gsap.utils.toArray('.proj-row').forEach((row) => {
        const cards = row.querySelectorAll('.proj-card')
        gsap.from(cards, {
          opacity: 0,
          y: 60,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: row, start: 'top 78%' },
          onStart: () => cards.forEach((c) => (c.style.willChange = 'transform, opacity')),
          onComplete: () => cards.forEach((c) => (c.style.willChange = '')),
        })
      })
    },
    { scope: root }
  )

  return (
    <section id="work" ref={root} className="section-pad">
      <div className="grid md:grid-cols-12 gap-10 mb-20">
        <div className="md:col-span-3">
          <p className="eyebrow">Selected work</p>
        </div>
        <div className="md:col-span-9">
          <h2 className="font-display font-medium tracking-tightest text-3xl md:text-5xl max-w-3xl">
            Products on the surface, models underneath
            <span className="text-gold-500">.</span>
          </h2>
        </div>
      </div>
      <Row label="Web — MERN platforms" items={projects.web} onOpen={open} />
      <Row label="Data — ML & analytics" items={projects.data} onOpen={open} />
      <CaseStudy project={active} onClose={close} />
    </section>
  )
}
