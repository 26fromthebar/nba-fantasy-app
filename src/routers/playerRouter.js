const express = require('express');
const Player = require('../models/player');
const { calculateBestPlayers, createTeams } = require('../utils/utils');

const router = new express.Router();

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

    const somesquads = sortedSquads.slice(0, 12);

    res.status(200).send(somesquads);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = router;
