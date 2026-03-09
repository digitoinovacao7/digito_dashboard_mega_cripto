/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': 'var(--color-bg-base)',
        'bg-surface': 'var(--color-bg-surface)',
        'primary-accent': 'var(--color-primary-accent)',
        'accent-gold': 'var(--color-accent-gold)',
        'cta-primary': 'var(--color-cta-primary)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-disabled': 'var(--color-text-disabled)',
        'border-subtle': 'var(--color-border-subtle)',
        'feedback-success': 'var(--color-feedback-success)',
        'feedback-error': 'var(--color-feedback-error)',
        'feedback-warning': 'var(--color-feedback-warning)'
      }
    },
  },
  plugins: [],
}
