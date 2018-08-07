
var mongoose = require('mongoose');
var widgetSchema = mongoose.Schema({
    data: String,
    type: String,
}, {collection: 'widgetSchema'});
module.exports = widgetSchema;