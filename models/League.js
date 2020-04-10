var mongoose = require('mongoose')

module.exports = mongoose.model('League', {
    name: String,
    numOfDivisions: Number,
    numOfTeams: Number
})