import * as React from 'react';
import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../styles/globals.css';
import localFont from '@next/font/local';

export const calibri = localFont({
  src: [
    {
      path: '../fonts/calibri.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/calibrib.ttf',
      weight: '700',
      style: 'bold',
    },
    {
      path: '../fonts/calibrii.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-calibri',
});

/* snipped for brevity */

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
];

const preview: Preview = {
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className={`${`font-calibri ${calibri.variable}`}`}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
