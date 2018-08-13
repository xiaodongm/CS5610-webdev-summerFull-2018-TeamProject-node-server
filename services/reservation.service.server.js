module.exports = function (app) {
    app.post('/api/event/:eventId/site/:siteId', reserveSiteForEvent);
    app.get('/api/event/:eventId/site', findReservationsForEvent);
    app.get('/api/site/:siteId/event', findReservationsForSite);
    app.delete('/api/event/:eventId/site/:siteId', unreserveSiteForEvent);
    app.get('/api/reservations', findAllReservations);
    app.get('/api/provider/:providerId', findReservationsForProvider);

    var eventModel = require('../models/event/event.model.server');
    var reservationModel = require('../models/reservation/reservation.model.server');
    var siteModel = require('../models/site/site.model.server');

    function reserveSiteForEvent(req, res) {
        const curUser = req.session.currentUser;
        if (curUser) {
            const eventId = req.params['eventId'];
            const siteId = req.params['siteId'];
            siteModel.findSiteById(siteId)
                .then(site => {
                    const reservation = {
                        provider: site.provider,
                        event: eventId,
                        site: siteId
                    };
                    eventModel.findEventById(eventId).then(
                        event => {
                            if (event.organizer != curUser._id && curUser.username !== 'admin') {
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
                                reservationModel.reserveSiteForEvent(reservation)
                                    .then(reserve => res.send(reserve));
                            }}
                        );
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

                    if (event.organizer != curUser._id && curUser.username !== 'admin') {
                        res.json({error: 'you don not have permission to do this'});
                    } else {
                        reservationModel
                            .unreserveSiteForEvent(reservation)
                            .then(reservation =>  {console.log(reservation);res.json(reservation)});
                    }
            });

        } else {
            res.json({error: 'Please log in'});
        }
    }

    function findAllReservations(req, res) {
        reservationModel
            .findAllReservations()
            .then(reservation =>  res.json(reservation));
    }

    function findReservationsForProvider(req, res){
        const providerId = req.params['providerId'];
        reservationModel
            .findReservationsForProvider(providerId)
            .then(reservation =>  res.json(reservation));
    }
};