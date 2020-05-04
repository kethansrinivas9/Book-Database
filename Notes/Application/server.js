const express = require('express');
const mongodb = require('mongodb');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

/* Function to retrieve the notes of particular keyword */
app.get('/retrievenotes/:name', (req,res) => {
    var fs = require('fs');
    obj = {};
    arr = [];

    fs.readFile('./json_files/notes.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {

        jsonObj = JSON.parse(data);
        
        for (var key in jsonObj.notes) {
            if (jsonObj.notes.hasOwnProperty(key) && jsonObj.notes[key].keyword == req.params.name) {
                arr.push(jsonObj.notes[key]);
            }
        }
        res.json(arr);
    }});
});

/* Function to store notes to the database */
app.post('/notes', (req,res) => {
    var fs = require('fs');

    fs.readFile('./json_files/notes.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {

        jsonObj = JSON.parse(data);

        note = {};
        note['keyword'] = req.body['keyword']
        note['note'] = req.body['note']
        jsonObj.notes.push(note)

        jsonString = JSON.stringify(jsonObj);
        fs.writeFile('./json_files/notes.json', jsonString, 'utf8', function (err) {
            if (err) throw err;
        });
    }});

    res.json({status: 200});
})

app.listen('3003', () => {
    console.log('Server started on port 3003');
});