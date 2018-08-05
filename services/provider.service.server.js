module.exports = function (app) {
    app.get('/api/provider', findAllProviders);
    app.get('/api/provider/providerId/:providerId', findProviderById);
    app.post('/api/provider/register', createProvider);
    app.get('/api/provider/profile', profile);
    app.post('/api/provider/logout', logout);
    app.post('/api/provider/login', login);
    app.put('/api/provider/profile', updateProvider);
    app.delete('/api/provider/profile', deleteProvider);

    const providerModel = require('../models/provider/provider.model.server');

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

    function deleteProvider(req, res) {
        var currentUser = req.session['currentUser'];
        if (!currentUser) {
            res.json({error: 'Please log in'});
        } else {
            // let enrolledSections = [];
            // enrollmentModel.findSectionsForStudent(currentUser._id)
            //     .then(sections => enrolledSections = sections)
            //     .then(() => {
            //         enrollmentModel.deleteEnrollmnetForUser(currentUser._id)
            //             .then(() => userModel.deleteUser(currentUser))
            //     })
            //     .then(() => {
            //         // console.log(enrolledSections);
            //         enrolledSections.forEach(enrollment => {
            //             sectionModel.incrementSectionSeats(enrollment.section._id)
            //                 .then(response => console.log(response));
            //         })
            //     }).then(() => res.send('200'));
            providerModel.deleteProvider(currentUser)
                .then(() => res.send('200'));
        }

    }
};