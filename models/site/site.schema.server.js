var mongoose = require('mongoose');
var siteSchema = mongoose.Schema({
    title: String,
    location: String,
    tags: [String],
    photos: [String],
    video: String,
    timeRange: [Date],
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProviderModel',
    },
    description: ['WidgetModel']
}, {collection: 'site'});

module.exports = siteSchema;