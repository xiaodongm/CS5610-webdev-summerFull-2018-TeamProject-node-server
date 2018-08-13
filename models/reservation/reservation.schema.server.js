var mongoose = require('mongoose');
var reservationSchema = mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventModel'
    },
    site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SiteModel'
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SiteModel'
    }
}, {collection: 'reservation'});
module.exports = reservationSchema;