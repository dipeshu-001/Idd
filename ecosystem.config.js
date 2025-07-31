
module.exports = {
  apps: [
    {
      name: 'shoob-scraper',
      script: 'index.js',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 10000,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
