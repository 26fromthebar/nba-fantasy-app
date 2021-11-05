const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (value.length > 40) {
        throw new Error("Player's name maximum length is 40 characters");
      }
    },
  },
  team: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    validate(value) {
      if (value.length !== 3) {
        throw new Error("Team's name length must be 3 characters");
      }
    },
  },
  position: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  avPoints: {
    type: Number,
    required: true,
  },
  nextGames: {
    type: Number,
    required: true,
  },
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
