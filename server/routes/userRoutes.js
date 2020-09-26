const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require('../models/user.model');
const authMiddleware = require('../middleware/auth.middleware');
const { getHighScore } = require('./gameRoutes');

router.post('/register', [
  body('email', 'Please enter a valid Email').isEmail().normalizeEmail().trim(),
  body('password', 'Password should be minimum 8 chars').isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  var { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User Already Exists" });
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = new User({ email, password });

    await user.save();

    let token = await getToken(user._id);
    res.status(200).json({
      token,
      highScore:0
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
})

router.post("/login",
  [
    body('email', 'Please enter a valid Email').isEmail().normalizeEmail().trim(),
    body('password', 'Password should be minimum 8 chars').isLength({ min: 8 })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({
          message: "User doesn't Exist"
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !"
        });

      let token = await getToken(user._id);
      let highScore = await getHighScore(user._id);
      res.status(200).json({
        token,
        highScore: highScore.score
      });

    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

async function getToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = {
      user: {
        id: userId
      }
    };
    jwt.sign(payload, process.env.JWT_STRING || "randomString", {
      expiresIn: '7d'
    }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  })
}

module.exports = router;