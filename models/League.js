var mongoose = require('mongoose')

module.exports = mongoose.model('League', {
    name: String,
    numOfDivisions: Number,
    numOfTeams: Number,
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})