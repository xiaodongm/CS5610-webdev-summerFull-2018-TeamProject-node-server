var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');
var userModel = mongoose.model('UserModel', userSchema);

function findUserByCredentials(credentials) {
    // console.log(credentials);
    return userModel.findOne(credentials);
}

function findUserById(userId) {
    return userModel.findById(userId);
}

function createUser(user) {
    //console.log(user);
    return userModel.create(user);
}

function findAllUsers() {
    return userModel.find();
}
function findUserByUsername(user) {
    return userModel.findOne(user);
}

function updateUser(user) {
    return result = userModel.findOneAndUpdate(
        {_id : user._id},
        {$set: user},
        {new: true},
    );
}

function deleteUser(user) {
    return userModel.remove(user)
}

var api = {
    createUser: createUser,
    findAllUsers: findAllUsers,
    findUserById: findUserById,
    findUserByCredentials: findUserByCredentials,
    findUserByUsername: findUserByUsername,
    updateUser: updateUser,
    deleteUser: deleteUser
};

module.exports = api;