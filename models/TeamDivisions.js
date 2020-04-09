var mongoose = require('mongoose')

var division = new mongoose.Schema({ 
        name: String,
        _id: String
})

module.exports = mongoose.model('TeamDivisions', {
    leagueName: String,
    divisions: [[division]]
    //author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})