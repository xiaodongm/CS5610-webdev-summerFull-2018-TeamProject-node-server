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
    location: String,
    lat: String,
    lng: String,
    profilePhoto: String,
    role:String,
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
    }],
}, {collection: 'user'});

module.exports = userSchema;