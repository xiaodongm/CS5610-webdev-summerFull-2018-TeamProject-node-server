var mongoose = require('mongoose');
var discussionSchema = mongoose.Schema({
    preDiscussion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DiscussionModel'
    },
    postPeople: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
    },
    content: String,
    postTime: Date,
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventModel'
    },
    type: String
}, {collection: 'discussion'});
module.exports = discussionSchema;