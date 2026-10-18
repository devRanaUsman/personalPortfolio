import { useRef, useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { projects, profile } from '../data/content'
import { ArrowUpRight } from './icons'

const all = [...projects.web, ...projects.data]
const github = profile.socials.find((s) => s.label === 'GitHub')?.href

function ProjectImage({ project, eager = false }) {
  return (
    <img
      src={project.image}
      alt={`${project.title} — illustrative project cover`}
      width="900"
      height="600"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="aspect-[3/2] w-full object-cover"
    />
  )
}

function Card({ project, onOpen }) {
  return (
    <article className="proj-card">
      <button type="button" onClick={() => onOpen(project)} className="card card-hover group block h-full w-full p-2.5 text-left" aria-label={`Open case study: ${project.title}`}>
        <div className="overflow-hidden rounded-[20px] border border-line bg-surface-soft">
          <ProjectImage project={project} />
        </div>
        <div className="flex items-start justify-between gap-3 px-2.5 pb-2 pt-4">
          <div>
            <h3 className="font-display text-[19px] tracking-tightest text-ink-900">{project.title}</h3>
            <p className="mt-1 text-[13px] text-ink-500">{project.kind}</p>
          </div>
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mint-50 text-mint-700"><ArrowUpRight /></span>
        </div>
      </button>
    </article>
  )
}

function CaseStudy({ project, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!project) return
    const dialog = ref.current
    const trigger = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      trigger?.focus({ preventScroll: true })
    }
  }, [project])

  if (!project) return null

  return createPortal(
    <dialog ref={ref} aria-labelledby="case-study-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose() }} className="project-dialog">
      <div className="overflow-hidden rounded-[28px] bg-white" onClick={(event) => event.stopPropagation()}>
        <div className="relative border-b border-line bg-surface-soft p-2.5">
          <div className="overflow-hidden rounded-[20px]"><ProjectImage project={project} eager /></div>
          <button type="button" autoFocus onClick={onClose} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink-700 hover:bg-mint-50" aria-label="Close case study">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-2"><span className="pill">{project.kind}</span><span className="pill bg-surface-tint text-ink-600">{project.year}</span></div>
          <h3 id="case-study-title" className="mt-5 font-display text-3xl tracking-tightest text-ink-900 sm:text-4xl">{project.title}</h3>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-700">{project.summary}</p>
          <p className="mt-4 leading-relaxed text-ink-500">{project.detail}</p>
          <ul className="mt-8 flex flex-wrap gap-2">{project.tech.map((item) => <li key={item} className="rounded-full border border-line bg-surface-soft px-3.5 py-1.5 text-[13px] text-ink-600">{item}</li>)}</ul>
          <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <button type="button" onClick={onClose} className="link-arrow">← Back to projects</button>
            {project.liveUrl ? (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hero-button hero-button-primary">Visit Site <ArrowUpRight /></a>
            ) : (
              <div className="text-right"><button type="button" disabled className="hero-button cursor-not-allowed bg-surface-tint text-ink-500">Visit Site <ArrowUpRight /></button><p className="mt-2 text-xs text-ink-500">Live preview coming soon</p></div>
            )}
          </div>
        </div>
      </div>
    </dialog>,
    document.body
  )
}

export default function Projects() {
  const [active, setActive] = useState(null)
  const close = useCallback(() => setActive(null), [])
  return (
    <section id="work" className="section-pad bg-white">
      <div className="shell">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight text-ink-900">Featured Projects</h2>
          <a href={github} target="_blank" rel="noopener noreferrer" className="link-arrow">View All Projects <ArrowUpRight /></a>
        </div>
        <div className="proj-grid mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((project) => <Card key={project.id} project={project} onOpen={setActive} />)}
        </div>
      </div>
      <CaseStudy project={active} onClose={close} />
    </section>
  )
}
