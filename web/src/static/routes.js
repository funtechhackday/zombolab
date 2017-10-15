let routes = [
    {
        name: 'index',
        path: '/',
        redirect: {name: 'about'}
    },
    {
        name: 'about',
        path: '/about',
        component: (done) => import('./page/about.js').then(c => done(c.default)),
    },
    {
        name: '404',
        path: '/404',
        component: (done) => import('./page/not-found.js').then(c => done(c.default)),
    },
    // low priority
    {
        name: 'otherwise',
        path: '/(.*)', // low priority
        redirect: {name: '404'}
    },
];

export default routes;