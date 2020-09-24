var express = require("express");
var mongoose = require("mongoose");
var cors = require('cors');

var app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.get('/', (req, res) => { 
  res.json('Hello from demo app!!!') 
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Listening on port ', process.env.PORT || 5000);
})