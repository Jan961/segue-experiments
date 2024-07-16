import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { preprocessor } from '@badeball/cypress-cucumber-preprocessor/browserify';
import browserify from '@badeball/cypress-cucumber-preprocessor/browserify';

// async function setupNodeEvents(on: any, config: any) {
//   await addCucumberPreprocessorPlugin(on, config);
//   on("file:preprocessor",browserify.default(config));

//   await require('cypress-mochawesome-reporter/plugin')(on);
//   // Make sure to return the config object as it might have been modified by the plugin.
//   return config;

// }

export default defineConfig({
  defaultCommandTimeout: 6000,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    overwrite: false,
    html: 'true',
    json: true,
  },
  env: {
    url: 'http://localhost:3000/',
  },
  retries: {
    runMode: 1,
  },
  projectId: 'r7yfj3',

  e2e: {
    testIsolation: false,
    setupNodeEvents(on: any, config: any) {},
    baseUrl: 'http://localhost:3000/',
    viewportWidth: 1600,
    viewportHeight: 1000,
    specPattern: 'cypress/e2e/*.ts',
  },
});
