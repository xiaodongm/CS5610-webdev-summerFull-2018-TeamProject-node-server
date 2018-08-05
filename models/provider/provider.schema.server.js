const mongoose = require('mongoose');
const extendSchema = require('mongoose-extend-schema');
const userSchema = require('../user/user.schema.server')

const providerSchema = extendSchema(userSchema, {
    organizationName: String,
    organizationAddress: String
},{collection: 'provider'});

module.exports = providerSchema;