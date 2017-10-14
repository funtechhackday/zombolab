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

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
}, collectionOptions);

userSchema.plugin(incrementId);

/** @var {Model} **/
module.exports = mongoose.model('User', userSchema);
