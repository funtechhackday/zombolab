"use strict";

const Router = require('koa-router');
const usersController = require('../controllers/users.js');
const fightsController = require('../controllers/fights.js');

const routerOpen = new Router();
const routerAuthOnly = new Router();

routerAuthOnly.get('/users/:uid/cards', usersController.getUserCards);
routerAuthOnly.put('/users/:uid/cards', usersController.putUserCards);
routerAuthOnly.get('/users/:uid', usersController.getUser);

routerAuthOnly.get('/', async (ctx, next) => ctx.body = {message: 'zombolab api'});

routerAuthOnly.post('/fights', fightsController.addToFight);
routerAuthOnly.get('/fights/:id', fightsController.getFight);

// const routing = new Router();
// routing.use(routerOpen);
// routing.use(routerAuthOnly);

module.exports = routerAuthOnly;