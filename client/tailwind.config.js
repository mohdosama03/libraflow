/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#141A2E',
        paper: '#F6F7FB',
        card: '#FFFFFF',
        indigo: {
          50: '#EEF0FF',
          100: '#E0E3FF',
          200: '#C3C8FF',
          300: '#9CA4FD',
          400: '#7A7FF2',
          500: '#5B5FE0',
          600: '#4547C4',
          700: '#3A3AA0',
          800: '#2E2E7D',
          900: '#1E1E52',
        },
        plum: {
          50: '#F6EEFF',
          100: '#EBDBFF',
          200: '#D6B7FF',
          300: '#B983FA',
          400: '#9C5CEB',
          500: '#7F3FCF',
          600: '#652FA8',
          700: '#4E2483',
          800: '#391A61',
          900: '#241040',
        },
        marine: {
          50: '#EAF1FC',
          100: '#CFE0F7',
          200: '#9FC1EF',
          300: '#6C9FE3',
          400: '#3F7CD3',
          500: '#255FB0',
          600: '#1B4A8C',
          700: '#153968',
          800: '#0F2A4C',
          900: '#0A1D35',
        },
        gold: '#D3A94E',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(20, 26, 46, 0.04), 0 8px 24px rgba(20, 26, 46, 0.06)',
        card: '0 1px 2px rgba(20, 26, 46, 0.04), 0 12px 32px rgba(30, 30, 82, 0.08)',
        lift: '0 20px 45px rgba(30, 30, 82, 0.16)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
