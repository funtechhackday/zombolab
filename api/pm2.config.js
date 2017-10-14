module.exports = {
    apps: [
        {
            name: 'API',
            script: 'index.js',
            instances: 1,
            exec_mode: 'cluster',
            watch: ['configs', 'controllers', '.'],
            ignore_watch : ['node_modules'],
            watch_options: {
                followSymlinks: false
            },
            env: {
                'SERVER_PORT': 3000
            },
            env_production: {
                'SERVER_PORT': 80
            }
        },
    ]
};
