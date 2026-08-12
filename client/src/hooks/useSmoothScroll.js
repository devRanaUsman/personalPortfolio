import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis smooth scroll wired into GSAP's ticker so ScrollTrigger and Lenis
 * share one RAF loop.
 *
 * `autoRaf: false` matters: recent Lenis versions start their own
 * requestAnimationFrame loop by default. Combined with the GSAP ticker below
 * that means TWO loops driving the same instance — Lenis integrates its
 * easing twice per frame at slightly different timestamps, which shows up as
 * micro-stutter that gets worse the longer each frame takes (i.e. fullscreen).
 */
export default function useSmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: false,
    })

    window.lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    /* ScrollTrigger recalculates every trigger's start/end on resize. During a
       window drag that fires continuously and each refresh is a full layout
       pass — the classic "resizing the window is chuggy" symptom. Debounce it
       to the end of the gesture. */
    ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' })

    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        lenis.resize()
        ScrollTrigger.refresh()
      }, 200)
    }
    window.addEventListener('resize', onResize)

    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      gsap.ticker.remove(raf)
      lenis.destroy()
      window.lenis = null
    }
  }, [])
}
