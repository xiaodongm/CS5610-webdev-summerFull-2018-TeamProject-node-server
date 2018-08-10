var mongoose = require('mongoose');
var eventSchema = mongoose.Schema({
    title: String,
    startTime: Date,
    endTime: Date,
    location: String,
    tags: [String],
    photos: [String],
    video: String,
    lat: String,
    lng: String,
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
    },
    attendee: [{ type: mongoose.Schema.Types.ObjectId,
                 ref: 'UserModel',}],
    description: ['WidgetModel'],
    level: String
}, {collection: 'event'});

module.exports = eventSchema;