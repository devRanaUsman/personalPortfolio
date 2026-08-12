import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Environment, Lightformer, Float } from '@react-three/drei'

/**
 * PERFORMANCE
 * -----------
 * A WebGL canvas costs (pixels x shader complexity) per frame, and `pixels`
 * is viewport_area x DPR^2. Maximised on a 1440p screen with a 2x display the
 * old settings asked for a 5120x2880 buffer WITH MSAA — roughly 9x the work
 * of the same scene in a small window. That is the whole "smooth small,
 * janky fullscreen" symptom.
 *
 * Fixes:
 *  - DPR is now budgeted: we target a maximum number of rendered pixels
 *    rather than a fixed multiplier, so a bigger window lowers DPR instead of
 *    multiplying the cost.
 *  - MSAA is switched off once DPR is high enough to do the smoothing for us.
 *  - Geometry detail 24 -> 16 (11,520 -> 5,120 tris) — visually identical
 *    under the distortion, noticeably cheaper to displace every frame.
 *  - The render loop stops entirely when the hero scrolls out of view, when a
 *    modal is open, or when the tab is hidden. Previously it rendered
 *    full-tilt even when you were at the bottom of the page.
 */

/* Target ~2.6 megapixels of render buffer. Comfortable on integrated GPUs,
   still crisp because the scene is a soft gradient blob rather than text. */
const PIXEL_BUDGET = 2_600_000

function computeDpr() {
  if (typeof window === 'undefined') return 1
  const area = window.innerWidth * window.innerHeight
  if (!area) return 1
  const budgeted = Math.sqrt(PIXEL_BUDGET / area)
  return Math.max(0.75, Math.min(window.devicePixelRatio || 1, 1.5, budgeted))
}

function GoldBlob() {
  const mesh = useRef()
  const pointer = useRef({ x: 0, y: 0 })
  const scrollY = useRef(0)

  /* Read scroll from a passive listener instead of touching window.scrollY
     inside useFrame — reading it mid-frame can force a style/layout flush. */
  useEffect(() => {
    const onScroll = () => {
      scrollY.current = window.scrollY
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame((state, delta) => {
    const m = mesh.current
    if (!m) return
    // Clamp delta so a dropped frame (tab switch, GC pause) can't cause a
    // sudden jump in rotation, which reads as a stutter.
    const d = Math.min(delta, 1 / 30)

    pointer.current.x += (state.pointer.x - pointer.current.x) * 0.04
    pointer.current.y += (state.pointer.y - pointer.current.y) * 0.04

    const scroll = scrollY.current * 0.0006
    m.rotation.y += d * 0.12
    m.rotation.x = pointer.current.y * 0.35 + scroll
    m.rotation.z = pointer.current.x * 0.25
    m.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08
  })

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <mesh ref={mesh} scale={1.55}>
        <icosahedronGeometry args={[1, 16]} />
        <MeshDistortMaterial
          color="#c9a961"
          metalness={0.92}
          roughness={0.18}
          distort={0.34}
          speed={1.6}
        />
      </mesh>
    </Float>
  )
}

export default function HeroScene() {
  const holder = useRef(null)
  const [dpr, setDpr] = useState(() => computeDpr())
  const [modalOpen, setModalOpen] = useState(false)
  const [onScreen, setOnScreen] = useState(true)
  const [tabVisible, setTabVisible] = useState(true)

  /* Recompute the DPR budget when the window is resized (debounced to the
     end of the resize so we don't reallocate the framebuffer 60x/second
     while the user drags the window edge — that alone caused big hitches). */
  useEffect(() => {
    let t = 0
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => setDpr(computeDpr()), 150)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    const handleToggle = () => setModalOpen(!!window.isProjectModalOpen)
    handleToggle()
    window.addEventListener('modal-toggle', handleToggle)
    return () => window.removeEventListener('modal-toggle', handleToggle)
  }, [])

  /* Stop rendering once the hero has scrolled away. */
  useEffect(() => {
    const el = holder.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: '10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const active = onScreen && tabVisible && !modalOpen

  const glOptions = useMemo(
    () => ({
      // Above ~1.25 DPR the extra samples buy almost nothing on a soft
      // gradient blob, and MSAA on a large buffer is expensive.
      antialias: dpr < 1.25,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    }),
    [dpr]
  )

  return (
    <div ref={holder} className="absolute inset-0">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={dpr}
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        gl={glOptions}
        style={{ pointerEvents: 'none', visibility: modalOpen ? 'hidden' : 'visible' }}
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 3, 5]} intensity={1.4} color="#e8cf9a" />
        <directionalLight position={[-5, -2, -4]} intensity={0.5} color="#7d6537" />
        <GoldBlob />
        {/* Local env map (no HDR download): warm panels for metallic reflections.
            `frames={1}` bakes it once instead of re-rendering the probe. */}
        <Environment resolution={64} frames={1}>
          <Lightformer intensity={2.2} color="#e8cf9a" position={[3, 2, 4]} scale={[6, 3, 1]} />
          <Lightformer intensity={0.8} color="#d4af7a" position={[-4, -1, -2]} rotation-y={Math.PI} scale={[5, 2, 1]} />
          <Lightformer intensity={0.4} color="#f2ede4" position={[0, 4, 0]} rotation-x={-Math.PI / 2} scale={[4, 4, 1]} />
        </Environment>
      </Canvas>
    </div>
  )
}
