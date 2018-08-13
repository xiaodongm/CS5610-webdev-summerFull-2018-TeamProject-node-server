var mongoose = require('mongoose');
var eventSchema = require('./event.schema.server');
var eventModel = mongoose.model('EventModel', eventSchema);

function findAllEvents() {
    return eventModel.find();
}

function findEventById(eventId) {
    return eventModel.findById(eventId);
}

function createEvent(event) {
    return eventModel.create(event);
}

function findEventsForUser(userId) {
    return eventModel.find({organizer: userId}).populate('attendee').exec();
}

function deleteEvent(eventId) {
    return eventModel.remove({_id: eventId});

}

function updateEvent(event) {
    return eventModel.update({_id: event._id}, {
        $set: event,
    })
}

function addNewAttendee(enventId, attendeeId) {
    return eventModel.update(
        {_id: enventId},
        {$push: {attendee: attendeeId}},
    );
}

function removeAttendee(enventId, attendeeId) {
    return eventModel.update(
        {_id: enventId},
        {$pull: {attendee: attendeeId}},
    );
}



var api = {
    findAllEvents: findAllEvents,
    findEventById: findEventById,
    createEvent: createEvent,
    findEventsForUser: findEventsForUser,
    deleteEvent: deleteEvent,
    updateEvent: updateEvent,
    addNewAttendee: addNewAttendee,
    removeAttendee: removeAttendee,
}

module.exports = api;