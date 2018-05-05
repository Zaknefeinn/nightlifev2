const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    twitterID:String,
    name:String
})

module.exports = mongoose.model('users', userSchema)