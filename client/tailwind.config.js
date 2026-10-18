/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* Text + dark surfaces. Deep pine-teal, not neutral grey, so the
           darks read as part of the mint family. */
        ink: {
          950: '#04120f',
          900: '#0a1d19',
          800: '#123029',
          700: '#274a43',
          600: '#3f6259',
          500: '#5c7a73',
          400: '#839b95',
          300: '#aec3bd',
          200: '#cfded9',
        },
        /* Accent. 500–700 carry buttons and links, 50–200 carry surfaces. */
        mint: {
          50: '#f3fbf8',
          100: '#e2f6ef',
          200: '#c2ebdf',
          300: '#95dcc7',
          400: '#5fc9ae',
          500: '#37b394',
          600: '#1f9278',
          700: '#167663',
          800: '#12594b',
        },
        surface: {
          DEFAULT: '#ffffff',
          soft: '#f6fbf9',
          tint: '#eaf6f2',
        },
        line: '#e4eeeb',
      },
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        body: ['"Satoshi"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      boxShadow: {
        /* Diffused ambient shadows — never a hard grey drop shadow. */
        soft: '0 1px 2px rgba(4, 32, 27, 0.04), 0 14px 32px -16px rgba(4, 32, 27, 0.14)',
        lift: '0 2px 6px rgba(4, 32, 27, 0.05), 0 32px 64px -28px rgba(4, 32, 27, 0.26)',
        inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.7)',
      },
      transitionTimingFunction: {
        fluid: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
  plugins: [],
}
