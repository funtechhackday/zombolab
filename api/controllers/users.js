"use strict";

const validator = require('Validator');
const User = require('../models/user.js');

/**
 * @param {{}} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
const getUserCards = async (ctx, next) => {
    let uid = ctx.params.uid;

    let user = await User.findOne({_id: uid});
    if (user === null) {
        ctx.throw(404, 'User not found');
    }

    ctx.body = user.cards;
};

/**
 * @param {{}} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
const putUserCards = async (ctx, next) => {
    let uid = ctx.params.uid;
    const params = ctx.request.body;

    const validations = {
        cards: 'array',
    };
    const resultValidation = validator.make(params, validations);
    if (resultValidation.fails()) {
        const errors = resultValidation.getErrors();
        ctx.throw(400, 'Bad params', {client: errors});
    }

    let user = await User.findOne({_id: uid});
    if (user === null) {
        ctx.throw(404, 'User not found');
    }
    user.cards = params.cards;

    await user.save();

    ctx.body = user;
};

/**
 * @param {{}} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
const getUser = async (ctx, next) => {
    let uid = +ctx.params.uid;
    let user = await User.findOne({_id: uid}).lean().exec();

    if (user === null) {
        ctx.throw(404, 'User not found');
    }

    ctx.body = user;
};

module.exports = {
    getUserCards: getUserCards,
    putUserCards: putUserCards,
    getUser: getUser,
};
