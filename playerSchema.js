const mongoose = require('mongoose');

//This is the MODEL for our data
const playerSchema = new mongoose.Schema({
    name: String,
    score: Number,
    time: Number,
    date: String
})

module.exports = mongoose.model("Player", playerSchema);