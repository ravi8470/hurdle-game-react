var express = require("express");
var mongoose = require("mongoose");

var app = express();
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.get('/', (req, res) => { 
  res.send('Hello from demo app!!!') 
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Listening on port ', process.env.PORT || 5000);
})