import type { StorybookConfig } from '@storybook/nextjs';
var path = require('path');

const config: StorybookConfig = {
  stories: ['../**/*.mdx', '../**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
    {
      name: '@storybook/addon-styling',
      options: {
        postCss: true,
      },
    },
  ],
  staticDirs: ['../public', { from: '../public/fonts', to: '/fonts' }],
  framework: {
    name: '@storybook/nextjs',
    options: { nextConfigPath: path.resolve(__dirname, '../next.config.js') },
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
