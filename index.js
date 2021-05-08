const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
  var express = require("express");
  var bodyParser = require("body-parser");
  var Request = require("request");
  var cors = require('cors');
  var path = require('path');
  var app = express();
  app.use(express.json());
  app.use(cors());
  var urlencodedParser = bodyParser.urlencoded({extended : false});
  var db;
  
  app.use(express.static(path.join(__dirname, 'ang-app')));
  
  const MongoClient = require('mongodb').MongoClient;
  const uri = "mongodb+srv://cmps415:cmps415@cmps415lindseyp.v5cto.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    const collection = client.db("cmps415lindseyp").collection("cmps415lindseyp");
    console.log("Connected to DB");
    
    db = client.db();
  });
  
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
  
  app.get('/', (req, res) => res.send("Backend"));
  
  app.get("/quizzes/", function(req, res) {
      db.collection("cmps415lindseyp").find({}).toArray(function(err, docs) {
          if (err) {
              handleError(res, err.message, "Failed to get quizzes.");
          } else {
              res.status(200).json(docs);
          }
      });
  });
  
  app.get("/quiz/id/", function(req, res) {
    let quizBody = (req.body).title;
    db.collection("cmps415lindseyp").find({title : quizBody}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get quiz id.");
        } else {
            res.status(200).json(docs);
        }
    });
  });
  
  app.post("/new/", function(req, res) {
    let body = (req.body);
    db.collection("cmps415lindseyp").insertOne(body, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new quiz.");
      } else {
        res.status(201).send(JSON.stringify(body));
      }
    });
    }
  );
  
  app.post("/quiz/id/", urlencodedParser, function(req, res) {
    let body = (req.body);
    db.collection("cmps415lindseyp").insertOne(body, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to submit quiz result.");
      } else {
        res.status(201).send("");
      }
    });
    }
  );
  
  // Generic error handler used by all endpoints.
  function handleError(res, reason, message, code) {
      console.log("ERROR: " + reason);
      res.status(code || 500).json({"error": message});
  }