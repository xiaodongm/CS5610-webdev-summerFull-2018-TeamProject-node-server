module.exports = function (app) {
    app.post('/api/event/create', createEvent);
    app.get('/api/events', findAllEvents);
    app.get('/api/event/:eventId', findEventById);
    app.delete('/api/event/:eventId', deleteEvent);
    app.get('/api/organizer/:userId/event', findEventsForUser);
    app.put('/api/event/:eventId', updateEvent);

    var eventModel = require('../models/event/event.model.server');
    var enrollmentModel = require('../models/enrollment/enrollment.module.server');
    
    function findAllEvents(req, res) {
        eventModel.findAllEvents()
            .then(events => res.send(events))
    }

    function findEventById(req, res) {
        const id = req.params['eventId'];
        eventModel.findEventById(id)
            .then(event => res.send(event));
    }

    function deleteEvent(req, res) {
        const curUser = req.session.currentUser;
        const eventId = req.params['eventId'];
        let enrollments = [];
        if(curUser) {
            enrollmentModel.findEnrollmentsForEvent(eventId)
                .then(response => enrollments = response)
                .then(() => eventModel.deleteEvent(eventId))
                .then(() => {
                    for(let i = 0; i < enrollments.length; i++) {
                        enrollmentModel.unenrollAttendeeInEvent(enrollments[i]).then();
                    }
                })
                .then(() => res.send('200'));
        } else {
            res.json({error: 'Please log in'});
        }
    }

    function createEvent(req, res) {
        const curUser = req.session.currentUser;
        const event = req.body;
        if(curUser) {
            eventModel.createEvent(event)
                .then(event => res.json(event));
        } else {
            res.json({error: 'Please log in'});
        }

    }

    function findEventsForUser(req, res) {
        const userId = req.params['userId'];
        eventModel.findEventsForUser(userId)
            .then(events => res.send(events));

    }

    function updateEvent(req, res) {
        const curUser = req.session.currentUser;
        const event = req.body;
        if(curUser) {
            eventModel.updateEvent(event)
                .then(event => res.json(event));
        } else {
            res.json({error: 'Please log in'});
        }

    }


}