"use strict";

const validator = require('Validator');
const Fight = require('../models/fight.js');
const User = require('../models/user.js');

/**
 * @param {{}} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
const addToFight = async (ctx, next) => {
    const params = ctx.request.body;

    const validations = {
        uid: 'integer'
    };
    const resultValidation = validator.make(params, validations);
    if (resultValidation.fails()) {
        const errors = resultValidation.getErrors();
        ctx.throw(400, 'Bad params', {client: errors});
    }

    let user = await User.findOne({_id: params.uid});
    if (user === null) {
        ctx.throw(404, 'User not found');
    }

    let fight = await Fight.findOne({status: 'waiting'});
    if (fight === null) {
        fight = new Fight;
    }

    fight.addPlayer(params.uid);
    let result = await fight.save();

    ctx.body = fight;
};

/**
 * @param {{}} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
const getFight = async (ctx, next) => {
    let id = +ctx.params.id;
    let fight = await Fight.findOne({_id: id}).lean().exec();

    if (fight === null) {
        ctx.throw(404, 'Fight not found');
    }

    ctx.body = fight;
};

module.exports = {
    addToFight: addToFight,
    getFight: getFight,
};
