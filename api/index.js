"use strict";

(async () => {
    require('dotenv').config();
    const mongoose = require('mongoose');

    const Koa = require('koa');
    const bodyParser = require('koa-body');
    const routing = require('./configs/routing.js');
    /** @var {Application} app */
    const app = new Koa();

    mongoose.Promise = global.Promise;
    await mongoose.connect(process.env.MONGO_CONNECT_STRING, {useMongoClient: true});

    app
        .use(async (ctx, next) => {
            try {
                await next();
            } catch (error) {
                ctx.body = {
                    error: error
                };
            }
        })
        .use(bodyParser({
            urlencoded: false,
            text:false,
            strict: false,
        }))
        .use(routing.routes())
        .use(routing.allowedMethods())
        .listen(+process.env.SERVER_PORT, () => {
            console.log('App listening on port: ' + process.env.SERVER_PORT);
        });
})();
