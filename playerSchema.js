const mongoose = require('mongoose');


const playerSchema = new mongoose.Schema({
    name: String,
    score: Number,
    time: Number,
    date: String
})

module.exports = mongoose.model("Player", playerSchema);