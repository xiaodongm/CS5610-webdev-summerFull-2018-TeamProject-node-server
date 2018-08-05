const mongoose = require('mongoose');
const providerSchema = require('./provider.schema.server');
const providerModel = mongoose.model('ProviderModel', providerSchema);

function findProviderByCredentials(credentials) {
    return providerModel.findOne(credentials);
}

function findProviderById(providerId) {
    return providerModel.findById(providerId);
}

function createProvider(provider) {
    return providerModel.create(provider);
}

function findAllProviders() {
    return providerModel.find();
}


function findProviderByUsername(username) {
    return providerModel.findOne({username: username});
}

function updateProvider(provider) {
    return result = providerModel.findOneAndUpdate(
        {_id : provider._id},
        {$set: provider},
        {new: true},
    );
}

function deleteProvider(provider) {
    return providerModel.remove(provider)
}

var api = {
    createProvider: createProvider,
    findAllProviders: findAllProviders,
    findProviderById: findProviderById,
    findProviderByCredentials: findProviderByCredentials,
    findProviderByUsername: findProviderByUsername,
    updateProvider: updateProvider,
    deleteProvider: deleteProvider
};

module.exports = api;