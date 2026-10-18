import { useEffect, useState } from 'react'
import { profile } from '../data/content'
import { ArrowUpRight } from './icons'

/* Same order as the page itself. */
const links = [
  ['Home', '#top'],
  ['About', '#about'],
  ['Projects', '#work'],
  ['Services', '#skills'],

  ['Contact', '#contact'],
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  /* Scroll state drives the bar's glass background. Coalesced into one rAF so
     Frequent scroll events can't cause a React render per frame. */
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setScrolled(window.scrollY > 12)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  /* The panel is mobile-only; close it if the viewport grows past lg. */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => e.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const bar = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ease-fluid ${
        bar ? 'border-line bg-white/85 backdrop-blur-xl' : 'border-line bg-white/95'
      }`}
    >
      <div className="shell flex max-w-[1480px] items-center justify-between py-5">
        <a href="#top" className="flex items-center gap-3 text-[21px] font-bold tracking-tight text-ink-900">
          <span className="text-[30px] font-bold italic tracking-[-.12em] text-mint-600" aria-hidden="true">UN</span>{profile.name}
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-[15px] text-ink-600 transition-colors duration-300 hover:bg-mint-50 hover:text-ink-900"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${profile.email}`}
            className="group hidden items-center gap-2 rounded-full bg-mint-600 py-1.5 pl-5 pr-1.5 text-[15px] font-medium text-white transition-colors duration-500 ease-fluid hover:bg-mint-700 sm:inline-flex"
          >
            Let&apos;s talk
            <span className="grid h-8 w-8 place-items-center rounded-full text-white transition-transform duration-500 ease-fluid group-hover:-translate-y-px group-hover:translate-x-0.5">
              <ArrowUpRight />
            </span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="nav-panel"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink-800 lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 block h-px w-4 bg-current transition-transform duration-500 ease-fluid ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-4 bg-current transition-transform duration-500 ease-fluid ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="nav-panel"
        inert={open ? undefined : ''}
        className={`overflow-hidden border-t border-line bg-white transition-[max-height,opacity] duration-700 ease-fluid lg:hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="shell flex flex-col py-4" aria-label="Mobile">
          {links.map(([label, href], i) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : '0ms' }}
              className={`border-b border-line/70 py-3.5 font-display text-xl tracking-tightest text-ink-900 transition-all duration-500 ease-fluid ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              }`}
            >
              {label}
            </a>
          ))}
          <a
            href={`mailto:${profile.email}`}
            onClick={() => setOpen(false)}
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-mint-700 px-6 py-3 text-[15px] font-medium text-white"
          >
            Let&apos;s talk
            <ArrowUpRight />
          </a>
        </nav>
      </div>
    </header>
  )
}
