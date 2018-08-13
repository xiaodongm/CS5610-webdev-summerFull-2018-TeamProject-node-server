module.exports = function (app) {
    app.get('/api/provider', findAllProviders);
    app.get('/api/provider/providerId/:providerId', findProviderById);
    app.post('/api/provider/register', createProvider);
    app.get('/api/provider/profile', profile);
    app.post('/api/provider/logout', logout);
    app.post('/api/provider/login', login);
    app.put('/api/provider/profile', updateProvider);
    // app.delete('/api/provider/profile', deleteProvider);
    app.delete('/api/provider/providerId/:providerId', deleteProvider);
    app.put('/api/admin/updateProvider', adminUpdateProvider);

    const providerModel = require('../models/provider/provider.model.server');
    const reservationModel = require('../models/reservation/reservation.model.server');
    const equipmentRentingModel = require('../models/equipmentRenting/equipmentRenting.model.server');
    const siteModel = require('../models/site/site.model.server');
    const equipmentModel = require('../models/equipment/equipment.model.server');

    function login(req, res) {
        var credentials = req.body;
        providerModel
            .findProviderByCredentials(credentials)
            .then(function(user) {
                if (user === null) {
                    res.json({error: 'can not find'})
                } else {
                    req.session['currentUser'] = user;
                    res.json(user);
                }
            })
    }

    function logout(req, res) {
        req.session.destroy();
        res.send(200);
    }

    function findProviderById(req, res) {
        var id = req.params['providerId'];
        providerModel.findProviderById(id)
            .then(function (user) {
                res.json(user);
            })
    }

    function profile(req, res) {
        var user = req.session['currentUser']
        if (user) {
            res.send(req.session['currentUser']);
        } else {
            res.json({error: 'Please log in'})
        }

    }

    function createProvider(req, res) {
        var user = req.body;
        providerModel.findProviderByUsername(user.username)
            .then(response => {
                if(response) {
                    res.json({err: 'Username already exist!'})
                } else {
                    providerModel.createProvider(user)
                        .then(response => {
                            req.session['currentUser'] = response;
                            res.json(response);
                        });
                }
            })
    }

    function findAllProviders(req, res) {
        providerModel.findAllProviders()
            .then(function (users) {
                res.send(users);
            })
    }

    // function findUserByUsername(req, res) {
    //     var username = req.params['username'];
    //     //console.log(username);
    //     userModel.findUserByUsername({username: username})
    //         .then(function (user) {
    //             res.json(user);
    //         })
    //     // res.send('hello');
    // }

    function updateProvider(req, res) {
        var newUser = req.body;
        // console.log(newUser);
        providerModel.updateProvider(newUser)
            .then(function (user) {
                req.session['currentUser'] = newUser;
                res.json(user);
            })

        // res.json(newUser);
    }

    function adminUpdateProvider(req, res) {
        var newUser = req.body;
        providerModel.updateProvider(newUser)
            .then(function (user) {
                req.session['currentUser'] = newUser;
                res.json(user);
            })
    }

    function deleteProvider(req, res) {
        var currentUser = req.session['currentUser'];
        console.log(currentUser);
        console.log(!currentUser);
        if (!currentUser) {
            res.json({error: 'Please log in'});
        } else {
            const id = req.params['providerId'];
            providerModel.findProviderById(id)
                .then(user => {
                    if(user){
                        if (user.role === 'SiteManager') {
                            let s;
                            siteModel.findSitesForProvider(user._id)
                                .then(sites => {
                                    s = sites;
                                    var sitesPromiseArray = [];
                                    for (const site of sites) {
                                        sitesPromiseArray.push(reservationModel.findReservationsForSite(site._id));
                                    }
                                    Promise.all(sitesPromiseArray)
                                        .then(reservations => {
                                            var reservationPromiseArray = [];
                                            for (const reservation of reservations) {
                                                reservationPromiseArray.push(reservationModel.unreserveSiteForEvent(reservation));
                                            }
                                            return Promise.all(reservationPromiseArray);
                                        }). then(() => {
                                            var sPromiseArray = [];
                                            for (const si of s) {
                                                sPromiseArray.push(siteModel.deleteSite(si._id));
                                            }
                                            return Promise.all(sPromiseArray);
                                    }).then(() => providerModel.deleteProviderById(id).then((response) => res.json(response)));
                                })
                        } else {
                            let e;
                            equipmentModel.findEquipmentsForProvider(user._id)
                                .then(equipments => {
                                    e = equipments;
                                    var equipmentsPromiseArray = [];
                                    for (const equipment of equipments) {
                                        equipmentsPromiseArray.push(equipmentRentingModel.findRentingsForEquipment(equipment._id));
                                    }
                                    Promise.all(equipmentsPromiseArray)
                                        .then(rentings => {
                                            var rentingPromiseArray = [];
                                            for (const renting of rentings) {
                                                console.log(rentings);
                                                rentingPromiseArray.push(equipmentRentingModel.returnEquipForEvent(renting));
                                            }
                                            return Promise.all(rentingPromiseArray);
                                        }). then(() => {
                                        var ePromiseArray = [];
                                        for (const eq of e) {
                                            ePromiseArray.push(equipmentModel.deleteEquipment(eq._id));
                                        }
                                        return Promise.all(ePromiseArray);
                                    }).then(() => providerModel.deleteProviderById(id).then((response) => res.json(response)));
                                })
                        }
                    } else {
                        res.json({error: 'There is no such user'});
                    }
                })
        }

    }

    function deleteProviderById(req, res) {
        const id = req.params['providerId'];
        providerModel.deleteProviderById(id)
            .then(() => res.send('200'));
    }
};