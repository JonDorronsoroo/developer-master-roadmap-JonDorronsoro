module.exports = {
    apps: [
      {
        name: 'roadmap',
        script: 'npm',
        interpreter: '/home/onboarding/.nvm/versions/node/v20.11.1/bin/node',
        args: 'run dev -- --host',
        watch: '.',
        instances: '1',
        autorestart: true,
        exec_mode: 'fork',
        env: {
          NODE_ENV: 'development',
        },
        env_production: {
          NODE_ENV: 'production',
          NVM_BIN: '/home/onboarding/.nvm/versions/node/v20.11.1/bin',
        },
      },
    ],
  };
  
