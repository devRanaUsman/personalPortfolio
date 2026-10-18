import { profile } from '../data/content'
import { ArrowUpRight } from './icons'

const quick = [
  ['Work', '#work'],
  ['About', '#about'],
  ['Skills', '#skills'],
  ['Experience', '#experience'],
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface-soft px-5 pb-8 pt-16 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display text-[22px] tracking-tightest text-ink-900">
              {profile.name}
            </p>
            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-ink-500">
              {profile.tagline} Six years of shipping both halves of that
              sentence.
            </p>
          </div>

          <div>
            <p className="text-[13px] font-medium text-ink-500">Quick links</p>
            <ul className="mt-4 space-y-3">
              {quick.map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-[15px] text-ink-700 transition-colors duration-300 hover:text-mint-700"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] font-medium text-ink-500">Elsewhere</p>
            <ul className="mt-4 space-y-3">
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[15px] text-ink-700 transition-colors duration-300 hover:text-mint-700"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] font-medium text-ink-500">Start a project</p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-500">
              One email is enough — tell me what you&apos;re building and I&apos;ll
              reply within a day.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="btn btn-ghost group mt-5 border-mint-200 bg-white"
            >
              {profile.email}
              <span className="btn-icon">
                <ArrowUpRight />
              </span>
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13.5px] text-ink-500">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p className="text-[13.5px] text-ink-500">
            Built with React, GSAP &amp; Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  )
}
