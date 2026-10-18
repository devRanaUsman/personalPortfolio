/* Hand-drawn 1.5px stroke icons — light, precise lines, currentColor. */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  'aria-hidden': 'true',
}

export function ArrowUpRight({ className = 'h-4 w-4' }) {
  return (
    <svg {...base} className={className}>
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </svg>
  )
}

export function ArrowRight({ className = 'h-4 w-4' }) {
  return (
    <svg {...base} className={className}>
      <path d="M4 12h15m-5.5-5.5L19 12l-5.5 5.5" />
    </svg>
  )
}

export function ArrowDown({ className = 'h-4 w-4' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 4v15m-5.5-5.5L12 19l5.5-5.5" />
    </svg>
  )
}

export function Check({ className = 'h-4 w-4' }) {
  return (
    <svg {...base} className={className}>
      <path d="M4.5 12.5 9 17l10.5-10.5" />
    </svg>
  )
}

export function Sparkle({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5c.9 4 1.7 5.4 5.8 6.4-4.1 1-4.9 2.4-5.8 6.4-.9-4-1.7-5.4-5.8-6.4 4.1-1 4.9-2.4 5.8-6.4Z" />
      <path d="M18 16.2c.4 1.7.8 2.3 2.5 2.7-1.7.4-2.1 1-2.5 2.7-.4-1.7-.8-2.3-2.5-2.7 1.7-.4 2.1-1 2.5-2.7Z" />
    </svg>
  )
}

export function Layers({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5 20 8l-8 4.5L4 8l8-4.5Z" />
      <path d="m4.5 12.6 7.5 4.2 7.5-4.2" />
      <path d="m4.5 16.8 7.5 4.2 7.5-4.2" />
    </svg>
  )
}

export function Brain({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5.2A3.2 3.2 0 0 0 6 6.6a3 3 0 0 0-1.6 5.2A3.2 3.2 0 0 0 6 17.4a3.2 3.2 0 0 0 6 1.4Z" />
      <path d="M12 5.2a3.2 3.2 0 0 1 6 1.4 3 3 0 0 1 1.6 5.2A3.2 3.2 0 0 1 18 17.4a3.2 3.2 0 0 1-6 1.4Z" />
      <path d="M12 5.2v13.6" />
    </svg>
  )
}

export function Mail({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5.5" width="18" height="13" rx="3" />
      <path d="m4.5 8 6.4 4.6a2 2 0 0 0 2.2 0L19.5 8" />
    </svg>
  )
}

export function Pin({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s6.5-5.6 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.4 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </svg>
  )
}

export function Clock({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 2" />
    </svg>
  )
}

export function Link({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M10 13.5a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7l-1.2 1.2" />
      <path d="M14 10.5a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 0 0 5.7 5.7l1.2-1.2" />
    </svg>
  )
}
