var mongoose = require('mongoose');
var equipmentSchema = require('./equipment.schema.server');
var equipmentModel = mongoose.model('EquipmentModel', equipmentSchema);

function findAllEquipments() {
    return equipmentModel.find();
}

function findEquipmentById(equipmentId) {
    return equipmentModel.findById(equipmentId);
}

function createEquipment(equipment) {
    return equipmentModel.create(equipment);
}

function findEquipmentsForProvider(userId) {
    return equipmentModel.find({provider: userId}).exec();
}

function deleteEquipment(equipmentId) {
    return equipmentModel.remove({_id: equipmentId});

}

function updateEquipment(equipment) {
    return equipmentModel.update({_id: equipment._id}, {
        $set: equipment,
    })
}

function returnbackEquipments(equipmentId, quantity) {
    return equipmentModel.update({_id: equipment._id}, {
        $inc: {available: +quantity}
    })
}

function takeawayEquipments(equipmentId, quantity) {
    return equipmentModel.update({_id: equipment._id}, {
        $inc: {available: -quantity}
    })
}

var api = {
    findAllEquipments: findAllEquipments,
    findEquipmentById: findEquipmentById,
    createEquipment: createEquipment,
    findEquipmentsForProvider: findEquipmentsForProvider,
    deleteEquipment: deleteEquipment,
    updateEquipment: updateEquipment,
    returnbackEquipments: returnbackEquipments,
    takeawayEquipments: takeawayEquipments,
}

module.exports = api;