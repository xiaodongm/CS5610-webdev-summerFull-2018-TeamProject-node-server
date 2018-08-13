module.exports = function (app) {
    app.post('/api/equipment/create', createEquipment);
    app.get('/api/equipments', findAllEquipments);
    app.get('/api/equipment/:equipmentId', findEquipmentById);
    app.delete('/api/equipment/:equipmentId', deleteEquipment);
    app.get('/api/provider/:providerId/equipment', findEquipmentsForProvider);
    app.put('/api/equipment/:equipmentId', updateEquipment);

    var equipmentModel = require('../models/equipment/equipment.model.server');
    // var enrollmentModel = require('../models/enrollment/enrollment.module.server');
    var equipmentRentingModel = require('../models/equipmentRenting/equipmentRenting.model.server');

    function findAllEquipments(req, res) {
        equipmentModel.findAllEquipments()
            .then(events => res.send(events))
    }

    function findEquipmentById(req, res) {
        const id = req.params['equipmentId'];
        equipmentModel.findEquipmentById(id)
            .then(event => res.send(event));
    }

    function deleteEquipment(req, res) {
         const curUser = req.session.currentUser;
        // const eventId = req.params['eventId'];
        // let enrollments = [];
        if(curUser) {
        //     enrollmentModel.findEnrollmentsForEvent(eventId)
        //         .then(response => enrollments = response)
        // .then(() => eventModel.deleteEvent(eventId))
        // .then(() => {
        //         for(let i = 0; i < enrollments.length; i++) {
        //         enrollmentModel.unenrollAttendeeInEvent(enrollments[i]).then();
        //     }
        // })
        // .then(() => res.send('200'));
            const equipmentId = req.params['equipmentId'];
            equipmentRentingModel.findRentingsForEquipment(equipmentId)
                .then(rentings => rentings.forEach(r => {
                    equipmentRentingModel.returnEquipForEvent(r).then();
                })).then(
                () => equipmentModel.deleteEquipment(equipmentId).then(() => res.send('200')));
        } else {
            res.json({error: 'Please log in'});
        }

    }

    function createEquipment(req, res) {
        const curUser = req.session.currentUser;
        const equipment = req.body;
        if(curUser) {
            equipmentModel.createEquipment(equipment)
                .then(e => res.json(e));
        } else {
            res.json({error: 'Please log in'});
        }

    }

    function findEquipmentsForProvider(req, res) {
        const providerId = req.params['providerId'];
        equipmentModel.findEquipmentsForProvider(providerId)
            .then(equipments => res.send(equipments));

    }

    function updateEquipment(req, res) {
        const curUser = req.session.currentUser;
        const equipment = req.body;
        if(curUser) {
            equipmentModel.updateEquipment(equipment)
                .then(e => res.json(e));
        } else {
            res.json({error: 'Please log in'});
        }

    }


}