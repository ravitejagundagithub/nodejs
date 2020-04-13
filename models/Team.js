var mongoose = require('mongoose')

module.exports = mongoose.model('Team', {
    name: String,
    phone: String,
    players: [],
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    league_id: { type: mongoose.Schema.Types.ObjectId, ref: 'League' }
})