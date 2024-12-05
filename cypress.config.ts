import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    reporter: 'mochawesome',
    reporterOptions: {
      useInlineDiffs: true,
      embeddedScreenshots: false,
      reportDir: 'cypress/results',
      reportFilename: '[name].html',
      overwrite: true,
      html: true,
      json: true,
    },
  },
});
