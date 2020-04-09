var mongoose = require('mongoose')

module.exports = mongoose.model('Team', {
    name: String,
    phone: String,
    players: [],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})