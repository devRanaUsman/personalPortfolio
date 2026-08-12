import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Subtle 3D tilt following the pointer. Transform-only, quickTo-driven.
 *
 * Same perf treatment as useMagnetic: rect cached on enter, moves coalesced
 * into one rAF, `will-change` only while hovered. With six project cards on
 * screen the old per-move getBoundingClientRect() was a measurable chunk of
 * every frame at large window sizes.
 *
 * Also listens for `modal-toggle` so tilting stops while the case-study
 * overlay is open.
 */
export default function useTilt(max = 7) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power3.out' })
    gsap.set(el, { transformPerspective: 900 })

    let rect = null
    let frame = 0
    let lastX = 0
    let lastY = 0

    const measure = () => {
      rect = el.getBoundingClientRect()
    }

    const apply = () => {
      frame = 0
      if (!rect || rect.width === 0 || rect.height === 0) return
      const px = (lastX - rect.left) / rect.width - 0.5
      const py = (lastY - rect.top) / rect.height - 0.5
      ry(px * max * 2)
      rx(-py * max * 2)
    }

    const onEnter = () => {
      if (window.isProjectModalOpen) return
      measure()
      el.style.willChange = 'transform'
    }

    const onMove = (e) => {
      if (window.isProjectModalOpen) return
      lastX = e.clientX
      lastY = e.clientY
      if (!rect) measure()
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const reset = () => {
      if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
      rect = null
      rx(0)
      ry(0)
      gsap.delayedCall(0.75, () => {
        el.style.willChange = ''
      })
    }

    const invalidate = () => {
      if (rect) measure()
    }

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', reset)
    window.addEventListener('modal-toggle', reset)
    window.addEventListener('scroll', invalidate, { passive: true })
    window.addEventListener('resize', invalidate)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', reset)
      window.removeEventListener('modal-toggle', reset)
      window.removeEventListener('scroll', invalidate)
      window.removeEventListener('resize', invalidate)
      el.style.willChange = ''
    }
  }, [max])

  return ref
}
