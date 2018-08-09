var mongoose = require('mongoose');
var discussionSchema = require('./discussion.schema.server');
var discussionModel = mongoose.model('DiscussionModel', discussionSchema);

function createDiscussion(discussion) {
    return discussionModel.create(discussion);
}

function deleteDiscussion(discussionId) {
    return discussionModel.remove({_id: discussionId});
}

function updateDiscussion(discussion) {
    return discussionModel.update({_id: discussion._id}, {$set: discussion},
        {new: true},
    )
}

function findAllDiscussions() {
    return discussionModel.find()
        .populate('preDiscussion')
        .populate('event')
        .exec();
}

function findDiscussionById(discussionId) {
    return discussionModel.find({_id: discussionId});
}

function findDiscussionsForUser(userId) {
    return discussionModel
        .find({postPeople: userId})
        .populate('preDiscussion')
        .populate('event')
        .exec();
}

var api = {
    createDiscussion: createDiscussion,
    deleteDiscussion: deleteDiscussion,
    updateDiscussion: updateDiscussion,
    findAllDiscussions: findAllDiscussions,
    findDiscussionById: findDiscussionById,
    findDiscussionsForUser: findDiscussionsForUser,
}

module.exports = api;