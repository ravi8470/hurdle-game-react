var express = require("express");
var mongoose = require("mongoose");
var cors = require('cors');

const InitiateMongoServer = require("./config/db.config");
InitiateMongoServer();

var app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.get('/', (req, res) => { 
  res.json('Hello from demo app!!!') 
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Listening on port ', PORT);
})