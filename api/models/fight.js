"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const incrementId = require('mongoose-sequence-id');

const collectionOptions = {
    autoIndex: true,
    read: 'secondaryPreferred',
    safe: {w: 'majority', wtimeout: 10000, j: 1},
    strict: true,
    useNestedStrict: true,
    timestamps: false,
    versionKey: false,
};

const fightSchema = new Schema({
    players: {
        type: [Number],
        validate: [
            {
                validator: (value) => {
                    return value.length === (new Set(value)).size;
                },
                message: 'users must be unique'
            },
            {
                validator: (value) => {
                    return value.length < 5;
                },
                message: 'users must be less that 5'
            }
        ]
    },
    status: {
        type: String,
        required: true,
        default: 'waiting',
        index: true
    },
    map: String,
    turns: Array,
}, collectionOptions);

fightSchema.plugin(incrementId);


/**
 * @param {Number} uid
 */
fightSchema.methods.addPlayer = function (uid) {
    this.players.push(uid);
    if (this.players.length === 4) {
        this.status = 'ready';
    }
};

/** @var {Model} **/
module.exports = mongoose.model('Fight', fightSchema);
