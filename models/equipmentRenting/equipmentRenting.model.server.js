var mongoose = require('mongoose');
var equipmentRentingSchema = require ('./equipmentRenting.schema.server');
var equipmentRentingModel = mongoose.model(
    'EquipmentRentingModel',
    equipmentRentingSchema
)

function rentEquipmentForEvent(renting) {
    return equipmentRentingModel.create(renting);
}

function findRentingsForEquipment(equipId) {
    return equipmentRentingModel
        .find({equipment: equipId})
        .populate('event')
        .exec();
}

function returnEquipForEvent(renting) {
    return equipmentRentingModel.findOneAndRemove({
        event: renting.event,
        equipment: renting.equipment
    });
}

function hasRent (eventId, equipId) {
    return equipmentRentingModel.find({event: eventId, equipment: equipId});
}

function findRentingsForEvent (eventId) {
    return equipmentRentingModel
        .find({event: eventId})
        .populate('equipment')
        .exec();

}



module.exports = {
    rentEquipmentForEvent: rentEquipmentForEvent,
    findRentingsForEquipment: findRentingsForEquipment,
    returnEquipForEvent: returnEquipForEvent,
    hasRent: hasRent,
    findRentingsForEvent: findRentingsForEvent
};