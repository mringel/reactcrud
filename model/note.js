var mongoose = require('mongoose');

var noteSchema = new mongoose.Schema({
	author: String,
	text: String,
	timestamp: Date

});

module.exports = mongoose.model('note', noteSchema);
