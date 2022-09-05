require('dotenv').config();

const express = require('express')
const app = express()
const mongoose = require('mongoose');
const port = 3000


mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to database"));

app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/css'));


app.get('/', function(req,res){
    res.redirect('index.html');
});

app.get('/questions.json', function(req, res){
    res.sendFile('questions.json');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))