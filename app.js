//LOAD VARIABLES FROM ENVIRONMENT
require('dotenv').config();

const express = require('express')
const app = express()
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const Player = require("./playerSchema");


//OPEN DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_ATLAS_URI, {useNewUrlParser: true});
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to database"));


//SERVE PUBLIC & BOOTSTRAP FOLDERS AS STATIC
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.urlencoded({extended: false}));


//-------CONTROLLER------
//HANDLE REQUESTS FROM CLIENT
app.get('/', function(req,res){
    console.log("Requested Home Page");
    res.redirect('index.html');
});

app.get('/ranking', function(req,res){
    console.log("Requested ranking.html ");
    res.redirect('/ranking.html');
})

app.get('/src/sample_questions.json', function(req, res){
    console.log("Requested 'questions.json' ");
    res.sendFile('src/sample_questions.json');
})


app.get('/rankingData', function(req,res){
    console.log("Ranking data requested");
    Player.find()
        .sort({score: -1, time: 1})
        .limit(15)
        .then((result) => {
            res.send(result);    
    }).catch();
})


app.post('/', async function(req,res){
    
    let newPlayer = new Player({
        name: req.body.name,
        score: req.body.score,
        time: req.body.time,
        date: req.body.date
    });

    console.log("PLAYER = " + newPlayer);
    try {
       newPlayer = await newPlayer.save();
       console.log("New Player Saved");
    } catch (error) {
        console.log(error);
    }
})

//START THE SERVER
app.listen(port, () => console.log(`Example app listening on port ${port}!`))