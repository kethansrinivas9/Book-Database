const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '20mb', extended: true}));

/* Function to search a complete string separated by spaces */
app.post('/addtocatalog', (req,res) => {
    var searchStr = req.body['name'];
    var result = req.body['result'];

    var fs = require('fs');

    fs.readFile('./json_files/catalog.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {

        jsonObj = JSON.parse(data);

        jsonObj.push({keyword: searchStr, result: result});

        jsonString = JSON.stringify(jsonObj);
        fs.writeFile('./json_files/catalog.json', jsonString, 'utf8', function (err) {
            if (err) throw err;
        });
    }});
});

app.listen('3001', () => {
    console.log('Server started on port 3001');
});