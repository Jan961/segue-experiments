/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

const colorsConfig = {
  'primary-black': '#000',
  'primary-orange': '#EC6255',
  'primary-yellow': '#FDCE74',
  'primary-green': '#41A29A',
  'primary-blue': '#0093C0',
  'soft-primary-blue': '#80c5e1',
  'primary-purple': '#7B568D',

  'primary-pink': '#E94580',
  'primary-navy': '#082B4B',
  'primary-dark-blue': '#21345B',
  'primary-red': '#D41818',
  'primary-white': '#FFF',
  'primary-button-hover': 'rgba(8, 43, 75, 0.6)',
  'primary-button-active': 'rgba(8, 43, 75, 0.8)',
  'secondary-purple': '#7B568D',
  'secondary-button-hover': '#E3EBF2',
  'secondary-button-active': '#617293',
  'tertiary-button-hover': '#F86C6C',
  'tertiary-button-active': '#891E1E',
  'disabled-button': '#DADCE5',
  'disabled-input': '#E9EBF0CC',
  'primary-input-text': '#617293',
  'primary-border': '#E9EBF0',
  'primary-list-row-hover': '#21345B99',
  'primary-list-row-active': '#21345BCC',
  'secondary-list-row': '#4646464d',
  'secondary-list-row-hover': '#464646b3',
  'secondary-list-row-active': '#707070',
  'primary-label': '#21345BCC',
  'secondary-green': '#10841C',
  'secondary-yellow': '#FFE606',
  'secondary-red': '#ED1111',
  'silver-gray-100': '#d9d9d9',
  primary: '#082B4B',
  secondary: '#617293',
};

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  plugins: [
    require('@tailwindcss/forms'),

    plugin(function ({ addUtilities, theme, addComponents }) {
      addComponents({
        '.container': {
          margin: theme('margin.auto'),
          maxWidth: theme('screens.lg'),
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
          '@media (min-width: 425px)': {
            paddingLeft: theme('spacing.8'),
            paddingRight: theme('spacing.8'),
          },
          '@media (min-width: 768px)': {
            paddingLeft: theme('spacing.24'),
            paddingRight: theme('spacing.24'),
          },
          '@media (min-width: 1024px)': {
            paddingLeft: theme('spacing.8'),
            paddingRight: theme('spacing.8'),
          },
        },
        '.container-fluid': {
          margin: theme('margin.auto'),
          maxWidth: theme('screens.xl'),
          paddingLeft: theme('spacing.5'),
          paddingRight: theme('spacing.5'),
          '@media (min-width: 425px)': {
            paddingLeft: theme('spacing.8'),
            paddingRight: theme('spacing.8'),
          },
          '@media (min-width: 768px)': {
            paddingLeft: theme('spacing.14'),
            paddingRight: theme('spacing.14'),
          },
          '@media (min-width: 1024px)': {
            paddingLeft: theme('spacing.20'),
            paddingRight: theme('spacing.20'),
          },
        },
        '.disabled-input': {
          '&:hover': {
            cursor: 'not-allowed !important',
          },
          opacity: 0.5,
          pointerEvents: 'none',
        },
      });
      addUtilities({
        // ! ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Container (Margins, Paddings & Gaps)
        '.mt-container': {
          marginTop: theme('spacing.10'),
          '@media (min-width: 768px)': {
            marginTop: theme('spacing.12'),
          },
          '@media (min-width: 1024px)': {
            marginTop: theme('spacing.16'),
          },
          '@media (min-width: 1440px)': {
            marginTop: theme('spacing.24'),
          },
        },
        '.mb-container': {
          marginBottom: theme('spacing.10'),
          '@media (min-width: 768px)': {
            marginBottom: theme('spacing.12'),
          },
          '@media (min-width: 1024px)': {
            marginBottom: theme('spacing.16'),
          },
          '@media (min-width: 1440px)': {
            marginBottom: theme('spacing.24'),
          },
        },

        // padding

        '.pt-container': {
          paddingTop: theme('spacing.6'),
          '@media (min-width: 525px)': {
            paddingTop: theme('spacing.10'),
          },
          '@media (min-width: 768px)': {
            paddingTop: theme('spacing.12'),
          },
          '@media (min-width: 1024px)': {
            paddingTop: theme('spacing.24'),
          },
        },
        '.pb-container': {
          paddingBottom: theme('spacing.6'),
          '@media (min-width: 525px)': {
            paddingBottom: theme('spacing.10'),
          },
          '@media (min-width: 768px)': {
            paddingBottom: theme('spacing.12'),
          },
          '@media (min-width: 1024px)': {
            paddingBottom: theme('spacing.24'),
          },
        },

        // ! ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Text Responsive Size
        // text-3xl md:text-4xl lg:text-5xl
        '.text-responsive-5xl': {
          fontSize: theme('fontSize.3xl'),
          '@media (min-width: 768px)': {
            fontSize: theme('fontSize.4xl'),
          },
          '@media (min-width: 1024px)': {
            fontSize: theme('fontSize.5xl'),
          },
        },
        // text-3xl md:text-4xl
        '.text-responsive-4xl': {
          fontSize: theme('fontSize.3xl'),
          '@media (min-width: 768px)': {
            fontSize: theme('fontSize.4xl'),
          },
        },
        // text-2xl md:text-3xl
        '.text-responsive-3xl': {
          fontSize: theme('fontSize.2xl'),
          '@media (min-width: 768px)': {
            fontSize: theme('fontSize.3xl'),
          },
        },
        // text-xl md:text-2xl
        '.text-responsive-2xl': {
          fontSize: theme('fontSize.xl'),
          '@media (min-width: 768px)': {
            fontSize: theme('fontSize.2xl'),
          },
        },
        // text-lg md:text-xl
        '.text-responsive-xl': {
          fontSize: theme('fontSize.lg'),
          '@media (min-width: 768px)': {
            fontSize: theme('fontSize.xl'),
          },
        },
        // text-base md:text-lg
        '.text-responsive-lg': {
          fontSize: theme('fontSize.base'),
          '@media (min-width: 768px)': {
            fontSize: theme('fontSize.lg'),
          },
        },
        // text-sm md:text-base
        '.text-responsive-base': {
          fontSize: theme('fontSize.sm'),
          '@media (min-width: 768px)': {
            fontSize: theme('fontSize.base'),
          },
        },
        // text-xs md:text-sm
        '.text-responsive-sm': {
          fontSize: theme('fontSize.xs'),
          '@media (min-width: 768px)': {
            fontSize: theme('fontSize.sm'),
          },
        },
      });
    }),
  ],
  darkMode: ['class', '[data-mode="dark"]'],
  theme: {
    screens: {
      xs: '425px',
      sm: '525px',
      md: '768px',
      lg: '1024px',
      midXl: '1220px',
      xl: '1440px',
    },
    extend: {
      animation: {
        shake: 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        shake: {
          '10%, 90%': {
            transform: 'translate3d(-1px, 0, 0)',
          },
          '20%, 80%': {
            transform: 'translate3d(2px, 0, 0)',
          },
          '30%, 50%, 70%': {
            transform: 'translate3d(-4px, 0, 0)',
          },
          '40%, 60%': {
            transform: 'translate3d(4px, 0, 0)',
          },
        },
      },
      fontFamily: {
        calibri: ['var(--font-calibri)'],
      },
      boxShadow: {
        'sm-shadow': '0px 5px 5px 0px rgba(112, 144, 176, 0.30)',
        'input-shadow': 'inset 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
      },
      colors: colorsConfig,
      backgroundOpacity: {
        65: '0.65',
        15: '0.15',
      },
      width: {
        5.5: '1.375rem',
        13: '3.125rem',
        33: '8.5rem',
        128: '32rem',
        132: '38rem',
      },
      height: {
        5.5: '1.375rem',
        13: '3.125rem',
        128: '32rem',
        'comp-height': '1.9375rem',
        'table-header-height': '3.1875rem',
      },
    },
  },
  safelist: [
    {
      pattern: /(bg|border)-(red|green|blue|slate|primary)-(100|200|300|400|500|600|700|800|input-text)/,
    },
  ],
};
