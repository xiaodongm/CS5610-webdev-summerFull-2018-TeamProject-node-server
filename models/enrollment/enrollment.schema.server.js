var mongoose = require('mongoose');
var enrollmentSchema = mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventModel'
    },
    attendee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
}, {collection: 'enrollments'});
module.exports = enrollmentSchema;