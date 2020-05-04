const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/log/:name', (req,res) => {
    var searchStr = req.params.name;

    var fs = require('fs');
    var obj = {};
    var arr = [];

    fs.readFile('./json_files/log.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {

        jsonObj = JSON.parse(data);
        
        var found = false;
        for (var index in jsonObj) {
            if (jsonObj[index].keyword == searchStr) {
                jsonObj[index].timestamp.push(Date.now());
                jsonObj[index].count += 1;
                found = true;
            }
        } 

        if (found == false){ 
            obj["keyword"] = searchStr;
            obj["count"] = 1;
            arr.push(Date.now());
            obj["timestamp"] = arr;

            jsonObj.push(obj);
        }

        jsonString = JSON.stringify(jsonObj);
        fs.writeFile('./json_files/log.json', jsonString, 'utf8', function (err) {
            if (err) throw err;
        });
    }});
    res.json({status: 200});
});


app.listen('3002', () => {
    console.log('Server started on port 3002');
});