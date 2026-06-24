/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta inspirada em rodovia, sinalização e moto
        asphalt: {
          DEFAULT: '#0a0a0a', // preto profundo (base)
          900: '#0a0a0a',
          800: '#141414',
          700: '#1c1c1c',
          600: '#2a2a2a',
          500: '#3a3a3a',
          400: '#525252',
          300: '#737373',
          200: '#a3a3a3',
          100: '#d4d4d4',
          50: '#f5f5f5'
        },
        // Amarelo de placa de trânsito / faixa de rodovia
        signal: {
          DEFAULT: '#f5c518',
          dark: '#d9ad11',
          light: '#fde04b'
        },
        // Vermelho de luz traseira / freio
        brake: {
          DEFAULT: '#e63946',
          dark: '#c1121f',
          light: '#ff5a67'
        },
        // Verde de "publicado" (mesmo verde do calendário do sofoto, harmonizado)
        liberated: {
          DEFAULT: '#2bb673',
          dark: '#208856',
          light: '#3dd58c'
        }
      },
      fontFamily: {
        // Display: condensada, forte, evoca placa rodoviária
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        // Body: clean mas com caráter
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        // Mono pra códigos/timestamps
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 350ms cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' }
        }
      }
    }
  },
  plugins: []
};
