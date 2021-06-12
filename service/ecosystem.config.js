module.exports = {
    apps: [
      {
        name: 'hitgall_prod',
        script: './backend/index.js',
        node_args: '--max-old-space-size=4096 --prof',
        exec_mode: 'cluster',
        instances: 4,
        autorestart: true,
        watch: false,
        max_memory_restart: '5G',
        listen_timeout: '2000',
        autorestart: true,
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
        node_args: '--max-old-space-size=4096 --prof',
        autorestart: false,
        watch: false,
        max_memory_restart: '2G',
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