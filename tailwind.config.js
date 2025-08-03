/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/store/**/*.{js,ts,jsx,tsx,mdx}',
    './src/types/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // The Hungry Hyena Brand Colors - Inspired by the logo
        brand: {
          red: '#DC2626', // Bold red from hyena's apron/accent
          orange: '#EA580C', // Vibrant orange from hyena's fur
          yellow: '#FBBF24', // Bright yellow from logo accents
          cream: '#FEF3C7', // Cream background from banner
          brown: '#92400E', // Rich brown from hyena's fur tones
          black: '#1F2937', // Deep black for text and outlines
          blue: '#3B82F6', // Strategic blue from logo background (used sparingly)
        },
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#DC2626', // Brand red - main brand color
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#EA580C', // Brand orange - secondary brand color
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7', // Brand cream
          200: '#fde68a',
          300: '#fcd34d',
          400: '#FBBF24', // Brand yellow - accent color
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e', // Brand brown
          900: '#78350f',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1F2937', // Brand black
        },
        // Strategic blue usage (from logo background - use sparingly)
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3B82F6', // Brand blue - accent only
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', '"Arial Black"', 'system-ui', 'sans-serif'], // Bold display font for headers
        heading: ['"Oswald"', '"Arial Black"', 'system-ui', 'sans-serif'], // Strong headings
        script: ['"Pacifico"', 'cursive'], // Fun script for accents
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
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1.1' }],
        '9xl': ['8rem', { lineHeight: '1.1' }],
        'mega': ['10rem', { lineHeight: '1' }], // Extra large for hero text
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'md': '0.25rem', 
        'lg': '0.375rem',
        'xl': '0.5rem',
        '2xl': '0.75rem',
        '3xl': '1rem',
        '4xl': '1.5rem', // Rounded for friendly hyena brand
        '5xl': '2rem', // More rounded for playful feel
        DEFAULT: '0.25rem',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shake': 'shake 0.5s ease-in-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'howl': 'howl 4s ease-in-out infinite', // Custom hyena animation
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(220, 38, 38, 0.8)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        howl: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.05) rotate(1deg)' },
          '50%': { transform: 'scale(1.1) rotate(0deg)' },
          '75%': { transform: 'scale(1.05) rotate(-1deg)' },
        },
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-image': "linear-gradient(rgba(31, 41, 55, 0.7), rgba(31, 41, 55, 0.7)), url('/images/food-truck-hero.jpg')",
        'food-pattern': "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23DC2626\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z\"/%3E%3C/g%3E%3C/svg%3E')",
        'truck-silhouette': "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 50\"%3E%3Cpath d=\"M10 40h10c0-5.5 4.5-10 10-10s10 4.5 10 10h20c0-5.5 4.5-10 10-10s10 4.5 10 10h10V20H70V10H10v30z\" fill=\"%23DC2626\" opacity=\"0.1\"/%3E%3C/svg%3E')",
        'hyena-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23EA580C\" fill-opacity=\"0.08\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3Ccircle cx=\"10\" cy=\"10\" r=\"3\"/%3E%3Ccircle cx=\"50\" cy=\"10\" r=\"3\"/%3E%3Ccircle cx=\"10\" cy=\"50\" r=\"3\"/%3E%3Ccircle cx=\"50\" cy=\"50\" r=\"3\"/%3E%3C/g%3E%3C/svg%3E')",
      },
      boxShadow: {
        'brand': '0 10px 25px -5px rgba(220, 38, 38, 0.3), 0 10px 10px -5px rgba(220, 38, 38, 0.1)',
        'truck': '0 20px 40px -10px rgba(234, 88, 12, 0.4)',
        'glow': '0 0 20px rgba(220, 38, 38, 0.4)',
        'neon': '0 0 5px theme(colors.primary.500), 0 0 20px theme(colors.primary.500), 0 0 35px theme(colors.primary.500)',
        'inset-brand': 'inset 0 2px 4px 0 rgba(220, 38, 38, 0.1)',
        'text': '2px 2px 4px rgba(0, 0, 0, 0.5)',
        'hyena': '0 15px 35px -5px rgba(234, 88, 12, 0.3), 0 10px 15px -5px rgba(251, 191, 36, 0.2)',
      },
      textShadow: {
        'sm': '1px 1px 2px rgba(0, 0, 0, 0.5)',
        'md': '2px 2px 4px rgba(0, 0, 0, 0.5)',
        'lg': '4px 4px 8px rgba(0, 0, 0, 0.5)',
        'brand': '2px 2px 4px rgba(220, 38, 38, 0.5)',
        'hyena': '3px 3px 6px rgba(146, 64, 14, 0.6)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-sm': {
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-md': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-lg': {
          textShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-brand': {
          textShadow: '2px 2px 4px rgba(220, 38, 38, 0.5)',
        },
        '.text-shadow-hyena': {
          textShadow: '3px 3px 6px rgba(146, 64, 14, 0.6)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}