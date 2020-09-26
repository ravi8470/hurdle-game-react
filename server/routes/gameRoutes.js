const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Game = require('../models/game.model');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', [
  authMiddleware,
  body('score', 'Invalid score provided').isInt({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  var { score } = req.body;
  try {

    let gamex = new Game({ score, user: req.userId });

    await gamex.save();
    res.status(200).json({
      success: true
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
})

router.get('/allow-play', authMiddleware, async (req, res) => {
  try {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    let countData = await Game.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(req.userId),
          createdAt: { $gte: date }
        }
      },
      {
        $count: 'gameCount'
      }
    ]);


    res.status(200).json(countData[0]);

  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Fetching");
  }
})

async function getHighScore(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      let highScore = await Game.findOne({ user: mongoose.Types.ObjectId(userId) }).sort('-score');
      resolve(highScore);
    } catch (err) {
      reject(err);
    }
  })
}
module.exports = { getHighScore, router };