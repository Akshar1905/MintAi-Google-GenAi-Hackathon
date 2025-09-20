/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', /* mint-200 with opacity */
        input: 'var(--color-input)', /* mint-50 */
        ring: 'var(--color-ring)', /* mint-300 */
        background: 'var(--color-background)', /* white */
        foreground: 'var(--color-foreground)', /* gray-800 */
        primary: {
          DEFAULT: 'var(--color-primary)', /* mint-300 */
          foreground: 'var(--color-primary-foreground)', /* gray-800 */
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', /* mint-400 */
          foreground: 'var(--color-secondary-foreground)', /* gray-800 */
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', /* red-300 */
          foreground: 'var(--color-destructive-foreground)', /* white */
        },
        muted: {
          DEFAULT: 'var(--color-muted)', /* mint-50 */
          foreground: 'var(--color-muted-foreground)', /* gray-500 */
        },
        accent: {
          DEFAULT: 'var(--color-accent)', /* mint-500 */
          foreground: 'var(--color-accent-foreground)', /* white */
        },
        popover: {
          DEFAULT: 'var(--color-popover)', /* white */
          foreground: 'var(--color-popover-foreground)', /* gray-800 */
        },
        card: {
          DEFAULT: 'var(--color-card)', /* white */
          foreground: 'var(--color-card-foreground)', /* gray-800 */
        },
        success: {
          DEFAULT: 'var(--color-success)', /* green-300 */
          foreground: 'var(--color-success-foreground)', /* gray-800 */
        },
        warning: {
          DEFAULT: 'var(--color-warning)', /* yellow-300 */
          foreground: 'var(--color-warning-foreground)', /* gray-800 */
        },
        error: {
          DEFAULT: 'var(--color-error)', /* red-300 */
          foreground: 'var(--color-error-foreground)', /* white */
        },
        surface: 'var(--color-surface)', /* mint-50 */
        'text-primary': 'var(--color-text-primary)', /* gray-800 */
        'text-secondary': 'var(--color-text-secondary)', /* gray-500 */
      },
      fontFamily: {
        'heading': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'caption': ['Source Sans Pro', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'lg': '0.5rem',
        'md': '0.375rem',
        'sm': '0.25rem',
      },
      boxShadow: {
        'neumorphic-sm': '4px 4px 12px rgba(0,0,0,0.03), -4px -4px 12px rgba(255,255,255,0.8)',
        'neumorphic': '6px 6px 18px rgba(0,0,0,0.05), -6px -6px 18px rgba(255,255,255,0.9)',
        'neumorphic-md': '8px 8px 20px rgba(0,0,0,0.05), -8px -8px 20px rgba(255,255,255,0.9)',
        'neumorphic-lg': '12px 12px 30px rgba(0,0,0,0.08), -12px -12px 30px rgba(255,255,255,0.95)',
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        '800': '800ms',
      },
      zIndex: {
        '100': '100',
        '200': '200',
        '300': '300',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}