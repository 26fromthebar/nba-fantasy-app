const express = require('express');
const Player = require('../models/player');
const { calculateBestPlayers, createTeams } = require('../utils/utils');

const router = new express.Router();

// Main logic router
router.post('/squads', async (req, res) => {
  try {
    // Minimize player pool based on their avPoints/price
    const pointGuards = await Player.find({ position: 'PG' });
    const shootingGuards = await Player.find({ position: 'SG' });
    const smallForwards = await Player.find({ position: 'SF' });
    const powerForwards = await Player.find({ position: 'PF' });
    const centers = await Player.find({ position: 'C' });

    const percentage = 0.6;

    const pg = calculateBestPlayers(pointGuards, percentage);
    const sg = calculateBestPlayers(shootingGuards, percentage);
    const sf = calculateBestPlayers(smallForwards, percentage);
    const pf = calculateBestPlayers(powerForwards, percentage);
    const c = calculateBestPlayers(centers, percentage);

    // Creating full squads in relation to team's budget
    const teamBudget = Number(req.body.budget);

    const allSquads = createTeams(pg, sg, sf, pf, c, teamBudget);

    // Sort the squads in descending order of points accumulation projection
    const sortedSquads = allSquads.squadsArr.sort(
      (a, b) => b.squadExpectedPoints - a.squadExpectedPoints
    );

    const somesquads = sortedSquads.slice(0, 2);

    res.status(200).send(somesquads);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.post('/add-player', async (req, res) => {
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
