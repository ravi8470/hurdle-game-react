const express = require("express");
const cors = require('cors');

const InitiateMongoServer = require("./config/db.config");
InitiateMongoServer();

// Routes
const userRouter = require('./routes/userRoutes');
const gameRouter = require('./routes/gameRoutes').router;

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.get('/', (req, res) => {
  res.json('Hello from demo app!!!') 
});

app.use('/api/user', userRouter)
app.use('/api/game', gameRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Listening on port ', PORT);
})