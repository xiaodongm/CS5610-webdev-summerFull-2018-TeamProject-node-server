var mongoose = require('mongoose');
var eventSchema = mongoose.Schema({
    title: String,
    startTime: Date,
    endTiME: Date,
    location: String,
    tags: [String],
    lat: String,
    lng: String,
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
    },
    attendee: [{ type: mongoose.Schema.Types.ObjectId,
                 ref: 'UserModel',}],
    description: ['WidgetModel']
}, {collection: 'event'});

module.exports = eventSchema;