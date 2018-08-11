var mongoose = require('mongoose');
var equipmentSchema = mongoose.Schema({
    title: String,
    location: String,
    tags: [String],
    photos: [String],
    video: String,
    quantity: Number,
    available: Number,
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProviderModel',
    },
    description: ['WidgetModel']
}, {collection: 'equipment'});

module.exports = equipmentSchema;