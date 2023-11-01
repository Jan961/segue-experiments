module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    /**
     * Main App Instance
     *
     */
    {
      name: 'theme',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: 'node_modules/next/dist/bin/next',
      args: 'npm run start',
      env_local: {
        APP_ENV: 'local', // APP_ENV=local
      },
      env_development: {
        APP_ENV: 'dev', // APP_ENV=dev
      },
      env_production: {
        APP_ENV: 'prod', // APP_ENV=prod
      },
    },
    /***
     *
     * Crons
     *
     */
    {
      name: 'Licence',
      script: 'crons/licence.tsx',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '0,30 * * * *',
      watch: false,
      autorestart: false,
    },
  ],
};
