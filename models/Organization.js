var mongoose = require('mongoose')

module.exports = mongoose.model('Organization', {
    name: String,
    heroImage: String,
    description: String,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})