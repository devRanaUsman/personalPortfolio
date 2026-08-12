import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Magnetic hover: element is gently pulled toward the cursor.
 *
 * Perf notes:
 *  - The element's rect is measured ONCE on pointerenter (and invalidated on
 *    scroll/resize) instead of on every pointermove. The old version called
 *    getBoundingClientRect() per move event, which forces a synchronous
 *    layout — with a nav full of magnetic links that is dozens of forced
 *    reflows per second, and it gets worse as the viewport grows.
 *  - Moves are coalesced into a single rAF so a high-polling-rate mouse
 *    (1000Hz gaming mice are common) can't fire 16 handlers per frame.
 *  - `will-change` is only set while hovering.
 */
export default function useMagnetic(strength = 0.35) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })

    let rect = null
    let frame = 0
    let lastX = 0
    let lastY = 0

    const measure = () => {
      rect = el.getBoundingClientRect()
    }

    const apply = () => {
      frame = 0
      if (!rect) return
      xTo((lastX - (rect.left + rect.width / 2)) * strength)
      yTo((lastY - (rect.top + rect.height / 2)) * strength)
    }

    const onEnter = () => {
      measure()
      el.style.willChange = 'transform'
    }

    const onMove = (e) => {
      lastX = e.clientX
      lastY = e.clientY
      if (!rect) measure()
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const onLeave = () => {
      if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
      rect = null
      xTo(0)
      yTo(0)
      // Drop the layer hint once the settle tween has finished.
      gsap.delayedCall(0.65, () => {
        el.style.willChange = ''
      })
    }

    // Cached rect goes stale when the page scrolls or resizes.
    const invalidate = () => {
      if (rect) measure()
    }

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', invalidate, { passive: true })
    window.addEventListener('resize', invalidate)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', invalidate)
      window.removeEventListener('resize', invalidate)
      el.style.willChange = ''
    }
  }, [strength])

  return ref
}
