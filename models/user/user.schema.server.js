var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    email: String,
    phoneNumber: String,
    address: String,
    profilePhoto: String,
    role:String,
}, {collection: 'user'});

module.exports = userSchema;