/**
 * Dependency-free text splitter (chars or words, wrapped in an
 * overflow-hidden line) so staggered reveals never rely on paid plugins.
 * Returns the array of animatable targets.
 */
export function splitText(el, by = 'words') {
  if (!el) return []
  if (el.dataset.split)
    return [...el.querySelectorAll(by === 'chars' ? '.split-char' : '.split-word')]

  const text = el.textContent
  el.textContent = ''
  el.dataset.split = by
  el.setAttribute('aria-label', text)

  const line = document.createElement('span')
  line.className = 'split-line'
  line.setAttribute('aria-hidden', 'true')

  const targets = []
  text.split(' ').forEach((word, i, arr) => {
    const w = document.createElement('span')
    w.className = 'split-word'
    if (by === 'chars') {
      ;[...word].forEach((ch) => {
        const c = document.createElement('span')
        c.className = 'split-char'
        c.textContent = ch
        w.appendChild(c)
        targets.push(c)
      })
    } else {
      w.textContent = word
      targets.push(w)
    }
    line.appendChild(w)
    if (i < arr.length - 1) line.appendChild(document.createTextNode(' '))
  })
  el.appendChild(line)
  return targets
}

/**
 * `will-change: transform` used to live in CSS on every .split-char, which
 * meant a few hundred permanently promoted compositor layers. Layer memory is
 * proportional to layer AREA, and these are viewport-sized display type — so
 * maximising the window multiplied the GPU memory and tanked the frame rate.
 *
 * These helpers hand the hint to the browser only for the duration of the
 * reveal, which is the only time it is useful.
 */
export function hintWillChange(targets) {
  const list = Array.isArray(targets) ? targets : [targets]
  list.forEach((t) => {
    if (t && t.style) t.style.willChange = 'transform, opacity'
  })
}

export function clearWillChange(targets) {
  const list = Array.isArray(targets) ? targets : [targets]
  list.forEach((t) => {
    if (t && t.style) t.style.willChange = ''
  })
}
