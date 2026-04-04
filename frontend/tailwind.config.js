/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark luxury theme colors
        dark: {
          900: '#0B0F1A',
          800: '#111827',
          700: '#1F2937',
          600: '#374151',
        },
        // Accent colors
        primary: {
          50: '#00E5FF',
          100: '#00E5FF',
          500: '#00E5FF',
        },
        success: '#22C55E',
        warning: '#F97316',
        danger: '#EF4444',
        // Glass colors
        glass: {
          white: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
          whiteStrong: 'rgba(255, 255, 255, 0.1)',
        }
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0B0F1A, #111827, #020617)',
        'gradient-primary': 'linear-gradient(135deg, #00E5FF, #00ACC1)',
        'gradient-success': 'linear-gradient(135deg, #22C55E, #16A34A)',
        'gradient-warning': 'linear-gradient(135deg, #F97316, #EA580C)',
        'gradient-danger': 'linear-gradient(135deg, #EF4444, #DC2626)',
        'grid-pattern': `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 229, 255, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 16px 64px 0 rgba(31, 38, 135, 0.37)',
        'glow': '0 0 20px rgba(0, 229, 255, 0.5)',
        'glow-lg': '0 0 40px rgba(0, 229, 255, 0.7)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
