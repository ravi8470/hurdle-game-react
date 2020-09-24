const express = require('express');
const router = express.Router();
const { body, check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require('../models/user.model');

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
      token
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
})

async function getToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = {
      user: {
        id: userId
      }
    };
    jwt.sign(payload, process.env.JWT_STRING || "randomString", {
      expiresIn: 10000
    }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  })
}

module.exports = router;