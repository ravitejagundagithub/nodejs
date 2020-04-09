var mongoose = require('mongoose')

var team = new mongoose.Schema({ 
    name: String,
    _id: String
})

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

module.exports = mongoose.model('Score', {
    selected_a: ObjectId,
    selected_b: ObjectId,
    scoreA: Number,
    scoreB: Number,
    level: String,
    leagueName: String,
    division: String
})