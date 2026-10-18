import { profile, stats } from '../data/content'
import { ArrowRight, ArrowUpRight } from './icons'

const stack = ['R', 'N', 'M', 'Py']

export default function Hero() {
  return (
    <section id="top" className="reference-hero">
      <img className="hero-echo" src="/images/usamanasir-portrait.jpg" alt="" aria-hidden="true" width="1275" height="1234" />
      <div className="shell hero-layout">
        <div className="hero-copy">
          <p className="hero-greeting">Hi, I’m {profile.name} <span aria-hidden="true">👋</span></p>
          <h1 className="hero-heading">
            <span>I Design &amp; Develop</span>
            <span>Modern Websites</span>
            <span className="hero-accent">That Make an Impact.</span>
          </h1>
          <p className="hero-description">
            I’m a Full Stack Developer specializing in building fast,
            responsive and user-friendly web applications. I turn ideas
            into clean, modern and scalable digital experiences.
          </p>
          <div className="hero-actions">
            <a href="#work" className="hero-button hero-button-primary">View My Work <ArrowRight /></a>
            <a href="#contact" className="hero-button hero-button-secondary">Get in Touch <ArrowUpRight /></a>
          </div>
          <div className="hero-proof">
            <div className="hero-stack" aria-label="React, Node.js, MongoDB and Python">
              {stack.map((item) => <span key={item}>{item}</span>)}
            </div>
            <svg className="hero-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 7h14M5 17h14" /></svg>
            <p>{stats[1].value}{stats[1].suffix} Projects Delivered<br />Worldwide</p>
          </div>
        </div>
        <div className="hero-visual">
          <img className="hero-portrait" src="/images/usamanasir-portrait.jpg" alt={`${profile.name}, full stack developer`} width="1275" height="1234" fetchpriority="high" />
          <div className="hero-developer-card">
            <span className="hero-code-icon" aria-hidden="true">‹/›</span>
            <div><strong>Full Stack Developer</strong><p>MERN Stack · Next.js · React</p></div>
            <span className="hero-status" aria-hidden="true" />
          </div>
          <div className="hero-experience-card">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 3c3-1 6-1 7-1 0 1 0 4-1 7l-6 6-5-5 5-7ZM8 10l-4 1-3 5 6-1 1-5Zm6 7-1 6 5-3 1-5-5 2ZM7 17c-3 0-4 4-4 4s4-1 4-4Z" /><circle cx="16" cy="7" r="2" fill="white" /></svg>
            <strong>{stats[0].value}{stats[0].suffix}</strong>
            <p>Years of<br />Experience</p>
          </div>
        </div>
      </div>
      <div className="hero-dots" aria-hidden="true" />
    </section>
  )
}
