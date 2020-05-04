const express = require('express');
const mongodb = require('mongodb');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const MACHINE_IP = (process.env.MACHINE_IP || "127.0.0.1");

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

var mongoClient = mongodb.MongoClient;
var url = "mongodb://root:kethan@3.83.239.149:27017/";

mongoClient.connect(url, function(err,db) {
	if(err)
		throw err;
    console.log('MongoDb Connected...');
	db.close;
});

/* Function to retrieve all books data */
app.get('/getbooksinfo', (req,res) => {
	mongoClient.connect(url, function(err,db) {
	if(err)
		throw err;
	
	var dbo = db.db("book_catalog");
	dbo.collection("book_info").find({}).toArray(function(err, result) {
		if (err) throw err;

		res.json(result);
		db.close();
	});
	});
});

/* Function to search a complete string separated by spaces */
app.get('/search/:name', (req,res) => {
	mongoClient.connect(url, function(err,db) {
	if(err)
		throw err;
	
    var dbo = db.db("book_catalog");
    dbo.collection("book_info").createIndex({author_name: "text", book_name: "text"});
    var searchStr = "\"".concat(req.params.name).concat("\"");

	dbo.collection("book_info").find({ $text : { $search : searchStr}}).toArray(function(err, result) {
        if (err) throw err;

        res.json(result);
              
        var logStr = req.params.name;
        request.get(`http://${MACHINE_IP}:3002/log/`.concat(logStr), (error, res, body) => {
        if (error) {
            console.error(error)
            return
        }
        });

        if(result.length > 0) {
            request.post({
                uri: `http://${MACHINE_IP}:3001/addtocatalog/`,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'name': req.params.name, 'result': result})
                }, (error, response, body) => {
                    if (error) {
                        console.error(error)
                        return
                  }
                });
        }
		db.close();
    });
	});
});

/* Function to search different strings separated by spaces based on OR aggregator */
app.get('/multisearch/:names', (req,res) => {
	mongoClient.connect(url, function(err,db) {
	if(err)
		throw err;
	
    var dbo = db.db("book_catalog");

    dbo.collection("book_info").createIndex({author_name: "text", book_name: "text"});

	dbo.collection("book_info").find({ $text : { $search : req.params.names}}).toArray(function(err, result) {
		if (err) throw err;
		res.json(result);
		db.close();
    });
	});
});

/* Function to retrieve the notes of particular keyword */
app.get('/retrievenotes/:name', (req,res) => {
    var name = req.params.name;
    request.get(`http://${MACHINE_IP}:3003/retrievenotes/`.concat(name), (error, response, body) => {
        if (error) {
            console.error(error)
            return
        }
        res.send(response["body"]);
    });
});

/* Function to store notes to the database */
app.post('/notes', (req,res) => {
    request.post({
        uri: `http://${MACHINE_IP}:3003/notes/`,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'keyword': req.body['keyword'], 'note': req.body['note']})
        }, (error, response, body) => {
            if (error) {
                console.error(error)
                return
          }
        });
    res.json({status: 200});
})

app.listen('3000', () => {
    console.log('Server started on port 3000');
    console.log(`machine ip is ${MACHINE_IP}`);
});