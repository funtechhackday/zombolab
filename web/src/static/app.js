import Vue from 'vue'; // external cdn
import Vuex from 'vuex'; // external cdn
import VueRouter from 'vue-router'; // external cdn
import routes from './routes.js';

import './app.less';

const router = new VueRouter({
    mode: 'history',
    routes: routes,
});

const store = new Vuex.Store;

store.registerModule('view', {
    namespaced: true,
    state: {}
});

const app = {};

Vue.component('app', {
    template: `<div id="app">
        <router-view></router-view>
    </div>`,
});

app.vueApp = new Vue({
    template: `<app></app>`,
    router: router,
    store: store,
    el: '#app',
});

export default app;