module.exports = function (app) {
    app.get('/api/user', findAllUsers);
    app.get('/api/user/userId/:userId', findUserById);
    app.post('/api/register', createUser);
    app.get('/api/profile', profile);
    app.post('/api/logout', logout);
    app.post('/api/login', login);
    // app.get('/api/user/username/:username', findUserByUsername);
    app.put('/api/profile', updateUser);
    // app.delete('/api/profile', deleteUser);
    app.delete('/api/user/userId/:userId', deleteUser);
    app.put('/api/admin/updateUser', adminUpdateUser);
    app.put('/api/user/follow/:userId', followUser);
    app.put('/api/user/un_follow/:userId', unfollowUser);
    app.get('/api/user/allFollows/:userId', findFollowingUsersForUser)

    var userModel = require('../models/user/user.model.server');
    var eventModel = require('../models/event/event.model.server');
    var enrollmentModel = require('../models/enrollment/enrollment.module.server');
    var equipmentRentingModel = require('../models/equipmentRenting/equipmentRenting.model.server');
    var reservationModel = require('../models/reservation/reservation.model.server');
    var eventServer = require('./event.service.server');



    function login(req, res) {
        var credentials = req.body;
        userModel
            .findUserByCredentials(credentials)
            .then(function (user) {
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
            res.json(req.session['currentUser']);
        } else {
            res.json({error: 'Please log in'})
        }

    }

    function createUser(req, res) {
        var user = req.body;
        userModel.findUserByUsername(user.username)
            .then(response => {
                if (response) {
                    res.json({err: 'Username already exist!'})
                } else {
                    userModel.createUser(user)
                        .then(response => {
                            req.session['currentUser'] = response;
                            res.json(response);
                        });
                }
            })
    }

    function findAllUsers(req, res) {
        userModel.findAllUsers()
            .then(function (users) {
                res.send(users);
            })
    }

    function followUser(req, res) {
        var curUser = req.session['currentUser'];
        if (curUser) {
            const userId = req.params['userId'];
            userModel.followUser(curUser._id, userId)
                .then(response => res.json(response));
        } else {
            res.json({error: 'Please log in'})
        }

    }

    function unfollowUser(req, res) {
        var curUser = req.session['currentUser'];
        if (curUser) {
            const userId = req.params['userId'];
            userModel.unfollowUser(curUser._id, userId)
                .then(response => res.json(response));
        } else {
            res.json({error: 'Please log in'})
        }
    }

    function findFollowingUsersForUser(req, res) {
        const userId = req.params['userId'];
        userModel.findUserById(userId)
            .then(response => {
                res.json(response.following);
            });
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

    function updateUser(req, res) {
        console.log('1');
        var newUser = req.body;
        // console.log(newUser);
        userModel.updateUser(newUser)
            .then(function (user) {
                req.session['currentUser'] = newUser;
                res.json(user);
            })

        // res.json(newUser);
    }

    function adminUpdateUser(req, res) {
        console.log('2');
        const newUser = req.body;
        userModel.updateUser(newUser)
            .then(function (user) {
                req.session['currentUser'] = newUser;
                res.json(user);
            })
    }

    function deleteUser(req, res) {
        var currentUser = req.session['currentUser'];
        if (!currentUser) {
            res.json({error: 'Please log in'});
        } else {
            let enrollments = [];
            const id = req.params['userId'];
            let organizedEvent = [];
            eventModel.findEventsForUser(id)
                .then(events => {
                    organizedEvent = events;
                    checkDelete(events).then(
                        response => {
                            if (response) {
                                var enrollPromiseArray = [];
                                for (const e of organizedEvent) {
                                    enrollPromiseArray.push(enrollmentModel.findEnrollmentsForEvent(e._id));
                                }

                                var organizedPromiseArray = [];
                                for (const event of organizedEvent) {
                                    organizedPromiseArray.push(eventModel.deleteEvent(event._id));
                                }

                                Promise.all(enrollPromiseArray)
                                    .then(() => {
                                        console.log('delete organized events enrollments');
                                        return Promise.all(organizedPromiseArray)

                                    })
                                    .then(
                                        () => {
                                            console.log('deleted organized events');
                                            return enrollmentModel.findEnrollmentsForAttendee(id);
                                        }
                                    ).then(
                                    (enrollments) => {
                                        var enrollmentPromiseArray = [];
                                        // var removeAttendeePromiseArray = [];
                                        for (const enrollment of enrollments) {
                                            console.log(enrollment);
                                            // removeAttendeePromiseArray.push(eventModel.removeAttendee(id, enrollment.event._id));
                                            enrollmentPromiseArray.push(enrollmentModel.unenrollAttendeeInEvent(enrollment));
                                        }
                                        // Promise.all(removeAttendeePromiseArray).then();
                                        return Promise.all(enrollmentPromiseArray);
                                    }
                                ).then(
                                    () => {
                                        userModel.deleteUserById(id)
                                            .then((response) => res.json(response));
                                    }
                                )

                            } else {
                                res.json({error: 'Sorry, you can not delete account before you returned all equipments and cancels all reservations!'})
                            }
                        }
                    );

                })
        }
    }


    function checkDelete(events) {
        // var isTrue = true;
        // for (let i = 0; i < events.length; i++ ) {
        //     let rentings = [];
        //     let reservations = [];
        //     equipmentRentingModel.findRentingsForEvent(events[i]._id)
        //         .then(response => {
        //             rentings = response;
        //             reservationModel.findReservationsForEvent(events[i]._id)
        //                 .then(response => {
        //                     reservations = response;
        //                     if (rentings.length > 0 || reservations.length > 0) {
        //                         isTrue = false;
        //                     }
        //                 })
        //
        //         })
        // }

        const promise_array = [];
        // const promise_array2 = [];
        var ok = true;
        for (const event of events) {
            promise_array.push(equipmentRentingModel.findRentingsForEvent(event._id));
            promise_array.push(reservationModel.findReservationsForEvent(event._id));
        }
        return Promise.all(promise_array)
            .then(response => {
                response.forEach(res => {
                    if (res.length > 0) {
                        ok = false;
                    }
                })
            }).then(() => ok);
    }

    function deleteUserById(req, res) {
        const id = req.params['userId'];
        userModel.deleteUserById(id)
            .then(() => res.send('200'));
    }
}
;