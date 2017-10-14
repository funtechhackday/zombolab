module.exports = {
    apps: [
        {
            name: 'API',
            script: 'index.js',
            instances: 1,
            exec_mode: 'cluster',
            env: {
                'SERVER_PORT': 80
            },
        },
    ]
};
