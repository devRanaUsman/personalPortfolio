import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { profile } from '../data/content'
import { ArrowUpRight, Mail, Pin, Clock, Link } from './icons'

gsap.registerPlugin(ScrollTrigger)

const IDLE = 'idle', SENDING = 'sending', SENT = 'sent', FAILED = 'failed'

const projectTypes = [
  'Web platform (MERN)',
  'Machine learning / data',
  'Both — web + ML',
  'Something else',
]

function InfoTile({ icon: Icon, label, children }) {
  return (
    <div className="rounded-[22px] border border-line bg-white p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="icon-chip h-9 w-9 rounded-[11px]">
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-[13px] font-medium text-ink-500">{label}</p>
      </div>
      <div className="mt-3.5 text-[15px] leading-relaxed text-ink-800">{children}</div>
    </div>
  )
}

export default function Contact() {
  const root = useRef(null)
  const [status, setStatus] = useState(IDLE)
  const [form, setForm] = useState({ name: '', email: '', projectType: projectTypes[0], message: '' })

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.from('.contact-reveal', {
        opacity: 0,
        y: 26,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 78%' },
      })
    },
    { scope: root }
  )

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (status === SENDING) return
    setStatus(SENDING)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus(SENT)
      setForm({ name: '', email: '', projectType: projectTypes[0], message: '' })
    } catch {
      setStatus(FAILED)
    }
  }

  return (
    <section id="contact" ref={root} className="section-pad bg-white">
      <div className="shell">
        <div className="shell-card">
          <div className="rounded-[26px] bg-white p-6 shadow-soft sm:p-10">
            <div className="contact-reveal max-w-[46ch]">
              <p className="eyebrow">Contact</p>
              <h2 className="mt-4 font-display text-[30px] font-semibold leading-tight tracking-tightest text-ink-900 sm:text-[38px]">
                Have a product that needs both halves?
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-ink-500">
                Tell me what you&apos;re building. I read everything myself and
                reply within a day.
              </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
              <div className="contact-reveal grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <InfoTile icon={Mail} label="Email">
                  <a href={`mailto:${profile.email}`} className="transition-colors duration-300 hover:text-mint-700">
                    {profile.email}
                  </a>
                </InfoTile>
                <InfoTile icon={Pin} label="Based in">
                  {profile.location}
                </InfoTile>
                <InfoTile icon={Clock} label="Availability">
                  Booking projects for Q4 2026.
                </InfoTile>
                <InfoTile icon={Link} label="Elsewhere">
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {profile.socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[14.5px] text-ink-700 transition-colors duration-300 hover:text-mint-700"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </InfoTile>
              </div>

              <form className="contact-reveal" onSubmit={submit} noValidate>
                <div className="form-tray">
                  <div className="grid sm:grid-cols-2">
                    <div className="form-field border-b border-line sm:border-b-0 sm:border-r">
                      <label htmlFor="c-name">Your name</label>
                      <input
                        id="c-name"
                        type="text"
                        placeholder="Your name"
                        required
                        value={form.name}
                        onChange={set('name')}
                      />
                    </div>
                    <div className="form-field border-b border-line sm:border-b-0">
                      <label htmlFor="c-email">Email address</label>
                      <input
                        id="c-email"
                        type="email"
                        placeholder="Your email"
                        required
                        value={form.email}
                        onChange={set('email')}
                      />
                    </div>
                  </div>

                  <div className="form-field relative border-t border-line">
                    <label htmlFor="c-type">Project type</label>
                    <select id="c-type" value={form.projectType} onChange={set('projectType')}>
                      {projectTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <svg
                      viewBox="0 0 24 24"
                      className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="m7 10 5 5 5-5" />
                    </svg>
                  </div>

                  <div className="form-field border-t border-line">
                    <label htmlFor="c-msg">Your message</label>
                    <textarea
                      id="c-msg"
                      rows="5"
                      className="resize-y"
                      placeholder="What are you building?"
                      required
                      value={form.message}
                      onChange={set('message')}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 border-t border-line bg-surface-soft px-5 py-4">
                    <button
                      type="submit"
                      disabled={status === SENDING}
                      className="btn btn-primary group disabled:opacity-60"
                    >
                      {status === SENDING ? 'Sending…' : 'Send message'}
                      <span className="btn-icon">
                        <ArrowUpRight />
                      </span>
                    </button>
                    <p aria-live="polite" className="text-[14px]">
                      {status === SENT && (
                        <span className="text-mint-700">Message saved — I&apos;ll reply within a day.</span>
                      )}
                      {status === FAILED && (
                        <span className="text-ink-500">
                          The form couldn&apos;t reach my inbox — email me at{' '}
                          <a className="text-mint-700 underline" href={`mailto:${profile.email}`}>
                            {profile.email}
                          </a>
                          .
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <p className="mt-3 px-1 text-[13px] text-ink-500">
                  Your details go to my inbox and nowhere else.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
