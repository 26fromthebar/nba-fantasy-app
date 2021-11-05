const express = require('express');
const Player = require('../models/player');

const router = new express.Router();

// Create a player document
router.post('/player/create', async (req, res) => {
  console.log(req.body);
  try {
    const player = new Player({
      name: req.body.name,
      team: req.body.team.toUpperCase(),
      position: req.body.position.toUpperCase(),
      price: parseFloat(req.body.price),
      avPoints: parseFloat(req.body.avPoints),
      nextGames: parseFloat(req.body.nextGames),
    });
    await player.save();
    res.status(200).send({
      message: `Player '${player.name}' has been added to database`,
      player,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Find players matching the options object
router.get('/find-player', async (req, res) => {
  try {
    const players = await Player.find({ name: 'CRs'.toLowerCase() });

    res.status(200).send(players);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = router;
