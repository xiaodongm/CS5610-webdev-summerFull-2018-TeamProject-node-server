var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://husky-camp-app.herokuapp.com");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

var session = require('express-session');
var maxTime = 1800;
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'any string',
    cookie: {
        maxAge: maxTime*1000
    },
    rolling: true
}));

app.get('/api/session/set/:name/:value',
    setSession);
app.get('/api/session/get/:name',
    getSession);

function setSession(req, res) {
    var name = req.params['name'];
    var value = req.params['value'];
    req.session[name] = value;
    res.send(req.session);
}

function getSession(req, res) {
    var name = req.params['name'];
    var value = req.session[name];
    res.send(value);
}

var userService = require('./services/user.service.server');
userService(app);

const providerService = require('./services/provider.service.server');
providerService(app);

const eventService = require('./services/event.service.server');
eventService(app);

const enrollmentService = require('./services/enrollment.service.server');
enrollmentService(app);

const discussionService = require('./services/discussion.service.server');
discussionService(app);


const equipmentService = require('./services/equipment.service.server');
equipmentService(app);

const siteService = require('./services/site.service.server');
siteService(app);

const reservationService = require('./services/reservation.service.server');
reservationService(app);

const equipmentRentingService = require('./services/equipmentRenting.service.server');
equipmentRentingService(app);

app.listen(process.env.PORT || 3000);

