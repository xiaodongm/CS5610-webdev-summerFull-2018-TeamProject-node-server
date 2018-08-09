module.exports = function (app) {
    app.post('/api/discussion/create', createDiscussion);
    app.delete('/api/discussion/:discussionId', deleteDiscussion);
    app.put('/api/discussion/update', updateDiscussion);
    app.get('/api/discussions', findAllDiscussions);
    app.get('/api/discussion/:discussionId', findDiscussionById);
    app.get('/api/discussion/user/:userId', findDiscussionsForUser);
    app.get('/api/discussion/event/:eventId', findDiscussionsForEvent);

    var discussionModule = require ('../models/discussion/discussion.model.server');
    
    function createDiscussion(req, res) {
        const curUser = req.session.currentUser;
        if (curUser) {
            const discussion = req.body;
            discussionModule
                .createDiscussion(discussion)
                .then(response => res.json(response));
        } else {
            res.json({error: 'Please log in'});
        }
    }

    function deleteDiscussion(req, res) {
        const curUser = req.session.currentUser;
        if (curUser) {
            const discussionId = req.params['discussionId'];
            discussionModule
                .deleteDiscussion(discussionId)
                .then(response => res.json(response));
        } else {
            res.json({error: 'Please log in'});
        }
    }

    function updateDiscussion(req, res) {
        const curUser = req.session.currentUser;
        if (curUser) {
            const discussion = req.body;
            discussionModule
                .updateDiscussion(discussion)
                .then(response => res.json(response));
        } else {
            res.json({error: 'Please log in'});
        }
    }

    function findAllDiscussions(req, res) {
        discussionModule
            .findAllDiscussions()
            .then(response => res.json(response));
    }

    function findDiscussionById(req, res) {
        const discussionId = req.params['discussionId'];
        discussionModule.findDiscussionById(discussionId)
            .then(response => res.json(response));
    }

    function findDiscussionsForUser(req, res) {
        const userId = req.params['userId'];
        discussionModule
            .findDiscussionsForUser(userId)
            .then(response => res.json(response));
    }

    function findDiscussionsForEvent(req, res) {
        const eventId = req.params['eventId'];
        discussionModule
            .findDiscussionsForEvent(eventId)
            .then(response => res.json(response));
    }
}