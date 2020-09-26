const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      required: true
    },
    user:{
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Game = mongoose.model("Game", GameSchema);

module.exports = Game;