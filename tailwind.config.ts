import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF3E6',
        paper: '#FFFCF5',
        honey: '#E78300',
        'honey-deep': '#C96A00',
        ink: '#2A1C0E',
        'ink-soft': '#5C4A35',
        sage: '#7A7F52',
        'sage-deep': '#5E633C',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Georgia', 'serif'],
        hand: ['var(--font-hand)', 'cursive'],
      },
      boxShadow: {
        jar: '0 24px 60px -24px rgba(42,28,14,0.55)',
        soft: '0 18px 50px -28px rgba(42,28,14,0.45)',
      },
    },
  },
  plugins: [],
}

export default config
