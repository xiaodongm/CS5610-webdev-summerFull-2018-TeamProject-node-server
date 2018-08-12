var mongoose = require('mongoose');
var siteSchema = require('./site.schema.server');
var siteModel = mongoose.model('SiteModel', siteSchema);

function findAllSites() {
    return siteModel.find();
}

function findSiteById(siteId) {
    return siteModel.findById(siteId);
}

function createSite(site) {
    return siteModel.create(site);
}

function findSitesForProvider(userId) {
    return siteModel.find({provider: userId}).exec();
}

function deleteSite(siteId) {
    return siteModel.remove({_id: siteId});

}

function updateSite(site) {
    return siteModel.update({_id: site._id}, {
        $set: site,
    })
}

function findSitesForProviderWithProviderInfo(userId) {
    return siteModel.find({provider: userId}).populate('provider').exec();
}


var api = {
    findAllSites: findAllSites,
    findSiteById: findSiteById,
    createSite: createSite,
    findSitesForProvider: findSitesForProvider,
    deleteSite: deleteSite,
    updateSite: updateSite,
    findSitesForProviderWithProviderInfo: findSitesForProviderWithProviderInfo
}

module.exports = api;