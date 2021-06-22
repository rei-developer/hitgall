module.exports = {
    apps: [
      {
        name: 'HITGALL_PRODUCTION',
        script: './backend/index.js',
        node_args: '--max-old-space-size=8192',
        exec_mode: 'cluster',
        instances: 4,
        autorestart: true,
        watch: false,
        max_memory_restart: '8192M',
        listen_timeout: '2000',
        autorestart: true,
        exp_backoff_restart_delay: 100,
        env: {
          HOST: process.env.HOST,
          PORT: process.env.PORT,
          NODE_ENV: 'production'
        },
        merge_logs: true,
        output: './logs/console.log',
        error: './logs/consoleError.log'
      },
      {
        name: 'hitgall_DEV',
        script: './backend/index.js',
        node_args: '--max-old-space-size=4096',
        autorestart: false,
        watch: true,
        max_memory_restart: '500M',
        listen_timeout: '2000',
        autorestart: false,
        env: {
          HOST: '127.0.0.1',
          PORT: 3000,
          NODE_ENV: 'development'
        },
        merge_logs: true,
        output: './logs/console.log',
        error: './logs/consoleError.log'
      }
    ],


    // deploy: {
    //   production: {
    //     user: 'node',
    //     host: '123.12.123.1',
    //     ref: 'origin/master',
    //     repo: 'git@github.com:repo.git',
    //     path: '/var/www/production',
    //     'post-deploy':
    //       'npm install && pm2 reload ecosystem.config.js --env production'
    //   }
    // }
  }
