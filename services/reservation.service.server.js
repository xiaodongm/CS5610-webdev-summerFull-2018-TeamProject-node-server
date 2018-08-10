module.exports = function (app) {
    app.post('/api/event/:eventId/site/:siteId', reserveSiteForEvent);
    app.get('/api/event/:eventId/site', findReservationsForEvent);
    app.get('/api/site/:siteId/event', findReservationsForSite);
    app.delete('/api/event/:eventId/site/:siteId', unreserveSiteForEvent);

    var eventModel = require('../models/event/event.model.server');
    var reservationModel = require('../models/reservation/reservation.model.server');

    function reserveSiteForEvent(req, res) {
        const curUser = req.session.currentUser;
        if (curUser) {
            const eventId = req.params['eventId'];
            const siteId = req.params['siteId'];
            const reservation = {
                event: eventId,
                site: siteId
            };
            eventModel.findEventById(eventId).then(
                event => {
                    if (event.organizer != curUser._id) {
                        res.json({error: 'you don not have permission to do this'});
                    } else {
                        return reservationModel.hasReserved(eventId, siteId);
                    }
                }
            )
            .then(response => {
                console.log(response);
            if (response.length !== 0) {
                res.json({error: 'has enrolled'});
            } else {
                reservationModel.reserveSiteForEvent({event: eventId, site: siteId})
                    .then(reserve => res.send(reserve));
            })
            }
        })
        } else {
            res.json({error: 'Please log in'});
        }

    }

    function findReservationsForEvent(req, res) {
        const eventId = req.params['eventId'];
        reservationModel
            .findReservationsForEvent(eventId)
            .then(enrollment => res.send(enrollment));
    }

    function findReservationsForSite(req, res) {
        const siteId = req.params['siteId'];
        reservationModel
            .findReservationsForSite(siteId)
            .then(enrollment => res.send(enrollment));
    }

    function unreserveSiteForEvent(req, res) {
        const curUser = req.session.currentUser;
        if (curUser) {
            const eventId = req.params['eventId'];
            const siteId = req.params['siteId'];
            const reservation = {
                event: eventId,
                site: siteId
            };
            eventModel.findEventById(eventId)
                .then(event => {
                    if (event.organizer !== curUser._id) {
                        res.json({error: 'you don not have permission to do this'});
                    } else {
                        return reservationModel
                            .unreserveSiteForEvent(reservation);
                    }
            }).then(reservation => res.send(reservation));

        } else {
            res.json({error: 'Please log in'});
        }
    }

}