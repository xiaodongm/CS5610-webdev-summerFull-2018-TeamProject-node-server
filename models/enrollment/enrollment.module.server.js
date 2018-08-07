var mongoose = require('mongoose');
var enrollmentSchema = require('./enrollment.schema.server');
var enrollmentModel = mongoose.model(
    'EnrollmentModel',
    enrollmentSchema
);

function enrollAttendeeInEvent(enrollment) {
    return enrollmentModel.create(enrollment);
}

function findEnrollmentsForAttendee(attendeeId) {
    return enrollmentModel
        .find({attendee: attendeeId})
        .populate('event')
        .exec();
}

function unenrollAttendeeInEvent(enrollment) {
    return enrollmentModel.remove(enrollment)
}

function hasEnrollmented (eventId, attendeeId) {
    return enrollmentModel.find({event: eventId, attendee: attendeeId});
}

function findEnrollmentsForEvent (eventId) {
    return enrollmentModel
        .find({event: eventId})
        .populate('attendee')
        .exec();

}

// function deleteEnrollmnetForUser (userId) {
//     return enrollmentModel.remove({attendee: userId});
// }

module.exports = {
    enrollAttendeeInEvent: enrollAttendeeInEvent,
    findEnrollmentsForAttendee: findEnrollmentsForAttendee,
    unenrollAttendeeInEvent: unenrollAttendeeInEvent,
    hasEnrollmented: hasEnrollmented,
    findEnrollmentsForEvent: findEnrollmentsForEvent,
   // deleteEnrollmnetForUser: deleteEnrollmnetForUser
};