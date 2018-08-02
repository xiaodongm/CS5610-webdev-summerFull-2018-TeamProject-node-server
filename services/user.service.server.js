module.exports = function (app) {
    app.get('/api/user', findAllUsers);
    app.get('/api/user/userId/:userId', findUserById);
    app.post('/api/register', createUser);
    app.get('/api/profile', profile);
    app.post('/api/logout', logout);
    app.post('/api/login', login);
    app.get('/api/user/username/:username', findUserByUsername);
    app.put('/api/profile', updateUser);
    app.delete('/api/profile', deleteUser);

    var userModel = require('../models/user/user.model.server');

    function login(req, res) {
        var credentials = req.body;
        userModel
            .findUserByCredentials(credentials)
            .then(function(user) {
                //console.log(user);
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

    function findUserById(req, res) {
        var id = req.params['userId'];
        userModel.findUserById(id)
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

    function createUser(req, res) {
        var user = req.body;
        userModel.createUser(user)
            .then(function (user) {
                req.session['currentUser'] = user;
                res.send(user);
            })
    }

    function findAllUsers(req, res) {
        userModel.findAllUsers()
            .then(function (users) {
                res.send(users);
            })
    }

    function findUserByUsername(req, res) {
        var username = req.params['username'];
        //console.log(username);
        userModel.findUserByUsername({username: username})
            .then(function (user) {
                res.json(user);
            })
        // res.send('hello');
    }

    function updateUser(req, res) {
        var newUser = req.body;
        // console.log(newUser);
        userModel.updateUser(newUser)
            .then(function (user) {
                req.session['currentUser'] = newUser;
                res.json(user);
            })

        // res.json(newUser);
    }

    function deleteUser(req, res) {
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
            userModel.deleteUser(currentUser)
                .then(() => res.send('200'));
        }

    }
}