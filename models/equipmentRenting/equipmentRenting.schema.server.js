var mongoose = require('mongoose');
var equipmentRentingSchema = mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventModel'
    },
    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EquipmentModel'
    },
    quantity: Number
}, {collection: 'equipmentRenting'});
module.exports = equipmentRentingSchema;