/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0A0A0F',
          50: '#F5F5F7',
          100: '#E8E8ED',
          200: '#C8C8D4',
          300: '#9898AE',
          400: '#6868883',
          500: '#3D3D5C',
          600: '#252540',
          700: '#16162E',
          800: '#0D0D1E',
          900: '#0A0A0F',
        },
        jade: {
          DEFAULT: '#00C896',
          50: '#E6FBF5',
          100: '#C0F5E6',
          200: '#80EBcc',
          300: '#40E0B3',
          400: '#00D49F',
          500: '#00C896',
          600: '#00A57C',
          700: '#008262',
          800: '#006048',
          900: '#003D2E',
        },
        coral: {
          DEFAULT: '#FF5C5C',
          100: '#FFE5E5',
          500: '#FF5C5C',
          600: '#E54545',
        },
        amber: {
          DEFAULT: '#FFB347',
          100: '#FFF3E0',
          500: '#FFB347',
        },
        sky: {
          DEFAULT: '#5CB8FF',
          100: '#E5F4FF',
          500: '#5CB8FF',
        },
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'spin-slow': 'spin 2s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-12px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      boxShadow: {
        'glow-jade': '0 0 20px rgba(0, 200, 150, 0.25)',
        'glow-sm': '0 0 10px rgba(0, 200, 150, 0.15)',
        'card': '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
};
