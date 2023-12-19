/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

const colorsConfig = {
  'primary-orange': '#ec6255',
  'primary-yellow': '#fdce74',
  'primary-green': '#41a29a',
  'primary-blue': '#0093c0',
  'soft-primary-blue': '#80c5e1',
  'primary-purple': '#7b568d',
  'primary-pink': '#e94580',
  'primary-navy': '#21345b',
  'dark-primary-green': '#42A29A',
  'soft-primary-green': '#BFE0DE',
  'soft-primary-grey': '#627293',
  'faded-primary-grey': '#f8f8fa',
  'soft-table-row-separation': '#e3ebf2',
  'table-row-alternating': '#f8f8f8',
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
        '.btn': {
          with: 'fit-content',
          height: 'fit-content',
          fontFamily: theme('fontFamily.gilroy'),
          fontWeight: theme('fontWeight.semibold'),
          textAlign: 'center',
          fontSize: theme('fontSize.sm'),

          paddingLeft: theme('spacing.3'),
          paddingRight: theme('spacing.3'),
          paddingTop: theme('spacing.2'),
          paddingBottom: theme('spacing.2'),
          gap: theme('spacing.3'),
          display: 'inline-flex',
          alignItems: 'center',
          borderRadius: theme('borderRadius.md'),
          transitionProperty: 'all',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDuration: '150ms',

          '&:hover': {
            transform: 'scale(1.05)',
          },
        },

        '.btn-primary': {
          backgroundColor: colorsConfig['primary-pink'],
          color: theme('colors.white'),
        },
        '.btn-primary-org': {
          backgroundColor: colorsConfig['primary-orange'],
          color: theme('colors.white'),
        },
        '.btn-primary-blue': {
          backgroundColor: colorsConfig['primary-blue'],
          color: theme('colors.white'),
        },
        '.btn-primary-green': {
          backgroundColor: colorsConfig['primary-green'],
          color: theme('colors.white'),
        },
        '.btn-primary-navy': {
          backgroundColor: colorsConfig['primary-navy'],
          color: theme('colors.white'),
        },
        '.btn-primary-purple': {
          backgroundColor: colorsConfig['primary-purple'],
          color: theme('colors.white'),
        },
        '.btn-primary-yellow': {
          backgroundColor: colorsConfig['primary-yellow'],
          color: theme('colors.white'),
        },

        '.btn.btn-lg': {
          fontSize: theme('fontSize.xl'),
          paddingLeft: theme('spacing.8'),
          paddingRight: theme('spacing.8'),
          paddingTop: theme('spacing.3'),
          paddingBottom: theme('spacing.3'),
          gap: theme('spacing.4'),
        },
        '.btn.btn-md': {
          fontSize: theme('fontSize.base'),
          paddingLeft: theme('spacing.6'),
          paddingRight: theme('spacing.6'),
          paddingTop: theme('spacing.2'),
          paddingBottom: theme('spacing.2'),
          gap: theme('spacing.4'),
        },
        '.btn.btn-sm': {
          fontSize: theme('fontSize.sm'),
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
          paddingTop: theme('spacing.2'),
          paddingBottom: theme('spacing.2'),
          gap: theme('spacing.2'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.btn.btn-xs': {
          fontSize: theme('fontSize.sm'),
          paddingLeft: theme('spacing.3'),
          paddingRight: theme('spacing.3'),
          paddingTop: theme('spacing.1'),
          paddingBottom: theme('spacing.1'),
          gap: theme('spacing.2'),
          fontWeight: theme('fontWeight.medium'),
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
      fontFamily: {
        primary: ['Ubuntu'],
      },
      colors: colorsConfig,
      fontSize: {
        default: '0.85rem',
      },
      with: {
        128: '32rem',
      },
      height: {
        128: '32rem',
      },
    },
  },
};
