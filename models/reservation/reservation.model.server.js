var mongoose = require('mongoose');
var reservationSchema = require('./reservation.schema.server');
var reservationModel = mongoose.model(
    'ReservationModel',
    reservationSchema
);

function reserveSiteForEvent(reservation) {
    return reservationModel.create(reservation);
}

function findReservationsForSite(siteId) {
    return reservationModel
        .find({site: siteId})
        .populate('event')
        .exec();
}

function unreserveSiteForEvent(reservation) {
    return reservationModel.findOneAndRemove({
        event: reservation.event,
        site: reservation.site
    });
}

function hasReserved (eventId, siteId) {
    return reservationModel.find({event: eventId, site: siteId});
}

function findReservationsForEvent (eventId) {
    return reservationModel
        .find({event: eventId})
        .populate('site')
        .exec();

}

// function deleteEnrollmnetForUser (userId) {
//     return enrollmentModel.remove({attendee: userId});
// }

function findAllReservations() {
    return reservationModel
        .find()
        .populate('event')
        .populate('site')
        .populate('provider')
}


function findReservationsForProvider(providerId) {
    return reservationModel.find({provider: providerId})
        .populate('event')
        .populate('site')
        .exec();
}

module.exports = {
    reserveSiteForEvent: reserveSiteForEvent,
    findReservationsForSite: findReservationsForSite,
    unreserveSiteForEvent: unreserveSiteForEvent,
    hasReserved: hasReserved,
    findReservationsForEvent: findReservationsForEvent,
    findAllReservations: findAllReservations,
    findReservationsForProvider: findReservationsForProvider,
    // deleteEnrollmnetForUser: deleteEnrollmnetForUser
};