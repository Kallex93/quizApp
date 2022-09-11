//LOAD VARIABLES FROM ENVIRONMENT
require('dotenv').config();

const express = require('express')
const app = express()
const mongoose = require('mongoose');
const port = 3000
const Player = require("./playerSchema");

//OPEN DATABASE CONNECTION
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to database"));


//SERVE PUBLIC & BOOTSTRAP FOLDERS AS STATIC
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.urlencoded({extended: false}));


//ROUTES
app.get('/', function(req,res){
    console.log("Requested Home Page");
    res.redirect('index.html');
});

app.get('/questions.json', function(req, res){
    res.sendFile('questions.json');
})


app.get('/ranking.html', function(req,res){
    console.log("Requested Ranking page");
    res.redirect('ranking.html');
})


app.post('/', async function(req,res){
    console.log("POST REQ: " + req.body);


    let newPlayer = new Player({
        name: req.body.name,
        score: req.body.score,
        time: req.body.time,
        date: req.body.date
    })

    console.log("PLAYER = " + newPlayer);

    try {
       newPlayer = await newPlayer.save();
       console.log("New Player Saved");
    } catch (error) {
        console.log(error);
    }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))