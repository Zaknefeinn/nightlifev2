const mongoose = require("mongoose");

const rsvpSchema = new mongoose.Schema({
    id:String,
    user:[String],
    userNames:[String],
    bar:String
})

module.exports = mongoose.model('RSVP', rsvpSchema)