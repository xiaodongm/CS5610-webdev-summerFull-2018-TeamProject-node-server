module.exports = function (app) {
    app.post('/api/event/:eventId/equip/:equipId', rentEquipmentForEvent);
    app.get('/api/event/:eventId/equip', findRentingsForEvent);
    app.get('/api/equip/:equipId/event', findRentingsForEquipment);
    app.delete('/api/event/:eventId/equip/:equipId', returnEquipForEvent);

    var eventModel = require('../models/event/event.model.server');
    var equipmentModel = require('../models/equipment/equipment.model.server');
    var equipmentRentingModel = require('../models/equipmentRenting/equipmentRenting.model.server')

    function rentEquipmentForEvent(req, res) {
        const curUser = req.session.currentUser;
        if (!curUser) {
            const eventId = req.params['eventId'];
            const equipId = req.params['equipId'];
            const rent = req.body;
            eventModel.findEventById(eventId).then(
                event => {
                    // if (event.organizer != curUser._id && curUser.username !== 'admin') {
                    //     res.json({error: 'you don not have permission to do this'});
                    // } else {
                        equipmentModel.findEquipmentById(equipId)
                            .then(equipment => {
                                if (rent.quantity > equipment.available) {
                                    res.json({error: 'Sorry, there is not enough equipment'});
                                } else {
                                    equipmentModel.takeawayEquipments(equipId, rent.quantity)
                                        .then(() => {
                                            equipmentRentingModel.rentEquipmentForEvent(rent)
                                                .then(response => res.json(response));
                                        })
                                }
                            })
                    // }
                });
        } else {
            res.json({error: 'Please log in'});
        }
}

function findRentingsForEvent(req, res) {
    const eventId = req.params['eventId'];
    equipmentRentingModel
        .findRentingsForEvent(eventId)
        .then(enrollment => res.send(enrollment));
}

function findRentingsForEquipment(req, res) {
    const equipId = req.params['equipId'];
    equipmentRentingModel
        .findRentingsForEquipment(equipId)
        .then(enrollment => res.send(enrollment));
}

function returnEquipForEvent(req, res) {
    const curUser = req.session.currentUser;
    if (curUser) {
        const eventId = req.params['eventId'];
        const equipId = req.params['equipId'];
        const rent = req.body;
        equipmentModel.findEquipmentById(equipId)
            .then(equip => {
                if (equip.provider != curUser._id && curUser.username !== 'admin') {
                    res.json({error: 'you don not have permission to do this'});
                } else {
                    equipmentModel.returnbackEquipments(equipId, rent.quantity)
                        .then(() => equipmentRentingModel.returnEquipForEvent(rent).then())
                }
            });

    } else {
        res.json({error: 'Please log in'});
    }
}
