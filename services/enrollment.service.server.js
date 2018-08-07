module.exports = function (app) {
    app.post('/api/attendee/:aid/event/:eid', enrollAttendeeInEvent);
    app.get('/api/attendee/:aid/event', findEnrollmentsForAttendee);
    app.delete('/api/attendee/:aid/event/:eid', unenrollAttendeeInEvent);

    var eventModel = require('../models/event/event.model.server');
    var enrollmentModel = require('../models/enrollment/enrollment.module.server');

    function enrollAttendeeInEvent(req, res) {
        const curUser = req.session.currentUser;
        if (curUser) {
            const eventId = req.params['eid'];
            const attendeeId = req.params['aid'];
            const enrollment = {
                attendee: attendeeId,
                event: eventId,
            };
            enrollmentModel.hasEnrollmented(eventId, attendeeId).then(response => {
                console.log(response);
                if (response.length !== 0) {
                    res.json({error: 'has enrolled'});
                } else {
                    eventModel.findEventById(eventId)
                        .then(event => {
                            if (event.organizer + '' === attendeeId) {
                                res.json({error: 'Can not enrolled in event hold by yourself'});
                            } else {
                                eventModel.addNewAttendee(eventId, attendeeId).then(response => console.log(response));
                                enrollmentModel.enrollAttendeeInEvent(enrollment)
                                    .then(enrollment => res.send(enrollment));
                            }
                        })
                }
            })
        } else {
            res.json({error: 'Please log in'});
        }

    }

    function findEnrollmentsForAttendee(req, res) {
            const attendeeId = req.params['aid'];
            enrollmentModel
                .findEnrollmentsForAttendee(attendeeId)
                .then(enrollment => res.send(enrollment));
    }

    function unenrollAttendeeInEvent(req, res) {
        const curUser = req.session.currentUser;
        if (curUser) {
            const eventId = req.params['eid'];
            const attendeeId = req.params['aid'];
            const enrollment = {
                attendee: attendeeId,
                event: eventId
            };
            eventModel.removeAttendee(eventId, attendeeId).then(response => console.log(response));
            enrollmentModel.unenrollAttendeeInEvent(enrollment)
                .then(enrollment => res.send(enrollment));
        } else {
            res.json({error: 'Please log in'});
        }
    }

}