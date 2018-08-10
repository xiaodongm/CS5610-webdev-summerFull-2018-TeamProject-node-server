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
    return reservationModel.remove(reservation)
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

module.exports = {
    reserveSiteForEvent: reserveSiteForEvent,
    findReservationsForSite: findReservationsForSite,
    unreserveSiteForEvent: unreserveSiteForEvent,
    hasReserved: hasReserved,
    findReservationsForEvent: findReservationsForEvent,
    // deleteEnrollmnetForUser: deleteEnrollmnetForUser
};