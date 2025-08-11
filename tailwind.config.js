/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* slate-700 */
        input: "var(--color-input)", /* slate-800 */
        ring: "var(--color-ring)", /* blue-600 */
        background: "var(--color-background)", /* slate-900 */
        foreground: "var(--color-foreground)", /* slate-50 */
        primary: {
          DEFAULT: "var(--color-primary)", /* blue-600 */
          foreground: "var(--color-primary-foreground)", /* slate-50 */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* slate-500 */
          foreground: "var(--color-secondary-foreground)", /* slate-50 */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* red-500 */
          foreground: "var(--color-destructive-foreground)", /* slate-50 */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* slate-700 */
          foreground: "var(--color-muted-foreground)", /* slate-400 */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* amber-500 */
          foreground: "var(--color-accent-foreground)", /* slate-900 */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* slate-800 */
          foreground: "var(--color-popover-foreground)", /* slate-50 */
        },
        card: {
          DEFAULT: "var(--color-card)", /* slate-800 */
          foreground: "var(--color-card-foreground)", /* slate-50 */
        },
        success: {
          DEFAULT: "var(--color-success)", /* emerald-500 */
          foreground: "var(--color-success-foreground)", /* slate-50 */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber-500 */
          foreground: "var(--color-warning-foreground)", /* slate-900 */
        },
        error: {
          DEFAULT: "var(--color-error)", /* red-500 */
          foreground: "var(--color-error-foreground)", /* slate-50 */
        },
        surface: "var(--color-surface)", /* slate-800 */
        'text-primary': "var(--color-text-primary)", /* slate-50 */
        'text-secondary': "var(--color-text-secondary)", /* slate-400 */
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        'panel': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'modal': '0 4px 6px rgba(0,0,0,0.1)',
      },
      transitionTimingFunction: {
        'engineering': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}