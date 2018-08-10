module.exports = function (app) {
    app.post('/api/site/create', createSite);
    app.get('/api/sites', findAllSites);
    app.get('/api/site/:siteId', findSiteById);
    app.delete('/api/site/:siteId', deleteSite);
    app.get('/api/provider/:providerId/site', findSitesForProvider);
    app.put('/api/site/:siteId', updateSite);

    var siteModel = require('../models/site/site.model.server');
    // var enrollmentModel = require('../models/enrollment/enrollment.module.server');

    function findAllSites(req, res) {
        siteModel.findAllSites()
            .then(sites => res.send(sites))
    }

    function findSiteById(req, res) {
        const id = req.params['siteId'];
        siteModel.findSiteById(id)
            .then(site => res.send(site));
    }

    function deleteSite(req, res) {
        // const curUser = req.session.currentUser;
        // const eventId = req.params['eventId'];
        // let enrollments = [];
        // if(curUser) {
        //     enrollmentModel.findEnrollmentsForEvent(eventId)
        //         .then(response => enrollments = response)
        // .then(() => eventModel.deleteEvent(eventId))
        // .then(() => {
        //         for(let i = 0; i < enrollments.length; i++) {
        //         enrollmentModel.unenrollAttendeeInEvent(enrollments[i]).then();
        //     }
        // })
        // .then(() => res.send('200'));
        // } else {
        //     res.json({error: 'Please log in'});
        // }
        const siteId = req.params['siteId'];
        // console.log(equipmentId);
        siteModel.deleteSite(siteId).then(() => res.send('200'));
    }

    function createSite(req, res) {
        const curUser = req.session.currentUser;
        const site = req.body;
        console.log(site);
        if(curUser) {
            siteModel.createSite(site)
                .then(s => res.json(s));
        } else {
            res.json({error: 'Please log in'});
        }

    }

    function findSitesForProvider(req, res) {
        const providerId = req.params['providerId'];
        siteModel.findSitesForProvider(providerId)
            .then(sites => res.send(sites));

    }

    function updateSite(req, res) {
        const curUser = req.session.currentUser;
        const site = req.body;
        if(curUser) {
            siteModel.updateSite(site)
                .then(s => res.json(s));
        } else {
            res.json({error: 'Please log in'});
        }

    }


}