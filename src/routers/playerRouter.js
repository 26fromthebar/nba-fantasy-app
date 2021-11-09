const express = require('express');
const Player = require('../models/player');

const router = new express.Router();

// Main logic router
router.get('/teams', async (req, res) => {
  try {
    // Minimize player pool based on their avPoints/price
    const pointGuards = await Player.find({ position: 'PG' });
    const shootingGuards = await Player.find({ position: 'SG' });
    const smallForwards = await Player.find({ position: 'SF' });
    const powerForwards = await Player.find({ position: 'PF' });
    const centers = await Player.find({ position: 'C' });

    const calculateBestPlayers = (playerPool) => {
      playerPool.forEach((player) => {
        let value = player.avPoints / player.price;
        player.value = parseFloat(value).toFixed(2);
      });

      const sortPlayers = playerPool.sort((a, b) => b.value - a.value);
      let playerCount = Math.round(sortPlayers.length * 0.8);
      const players = sortPlayers.slice(0, playerCount);
      return players;
    };

    const pg = calculateBestPlayers(pointGuards);
    const sg = calculateBestPlayers(shootingGuards);
    const sf = calculateBestPlayers(smallForwards);
    const pf = calculateBestPlayers(powerForwards);
    const c = calculateBestPlayers(centers);

    // Function for checking if a squad does not have more than two players from the same team
    const isSquadValid = (squad) => {
      // First way to count how many times a team appears
      // const tallySquads = squad.reduce((tally, val) => {
      //   tally[val] = (tally[val] || 0) + 1;
      //   return tally;
      // }, {});
      // if (
      //   Object.values(tallySquads).includes(3) ||
      //   Object.values(tallySquads).includes(4) ||
      //   Object.values(tallySquads).includes(5) ||
      //   Object.values(tallySquads).includes(6)
      // ) {
      //   return false;
      // } else {
      //   return true;
      // }

      // Second way to achieve the same result
      const validArray = [];

      squad.forEach((team) => {
        let count = squad.toString().split(team).length - 1;
        validArray.push(count);
      });

      if (
        validArray.includes(3) ||
        validArray.includes(4) ||
        validArray.includes(5)
      ) {
        return false;
      } else {
        return true;
      }
    };

    // Creating doubles based on same position
    const createDoubles = (arr) => {
      const doublesArr = [];
      arr.forEach((item, index) => {
        for (let i = index + 1; i < arr.length; i++) {
          const double = [item, arr[i]];
          doublesArr.push(double);
        }
      });
      return doublesArr;
    };

    // Creating quadruplets
    const createQuadruplets = (arr1, arr2) => {
      const quadrupletsArr = [];
      arr1.forEach((item1) => {
        arr2.forEach((item2) => {
          const quadruplet = item1.concat(item2);
          const quadrupletsTeams = quadruplet.map((item) => item.team);

          if (isSquadValid(quadrupletsTeams)) {
            quadrupletsArr.push(quadruplet);
          }
        });
      });

      return quadrupletsArr;
    };

    // Creating full squads
    const createSquads = (arr1, arr2, arr3) => {
      const fullsquadsArr = [];
      arr1.forEach((item1) => {
        arr2.forEach((item2) => {
          arr3.forEach((item3) => {
            const fullSquad = item1.concat(item2, item3);
            const fullSquadTeams = fullSquad.map((item) => item.team);

            if (isSquadValid(fullSquadTeams)) {
              fullsquadsArr.push(fullSquad);
            }
          });
        });
      });

      // Combining all player objects into a squad object
      const squads = fullsquadsArr.map((squad) => {
        const squadObj = {
          lineup: [],
          playerIds: [],
          // teams: [],
          // positions: [],
          // prices: [],
          totalBudget: 0,
          projectedPoints: 0,
          // nextGames: [],
          totalnextGames: 0,
        };

        squad.forEach((item) => {
          squadObj.lineup.push(item.name);
          squadObj.playerIds.push(item._id);
          // squadObj.teams.push(item.team);
          // squadObj.positions.push(item.position);
          // squadObj.prices.push(item.price);
          squadObj.totalBudget += item.price;
          squadObj.projectedPoints += item.avPoints * item.nextGames;
          // squadObj.nextGames.push(item.nextGames);
          squadObj.totalnextGames += item.nextGames;
        });
        return squadObj;
      });
      return squads;
    };

    const pgDoubles = createDoubles(pg);
    const sgDoubles = createDoubles(sg);
    const sfDoubles = createDoubles(sf);
    const pfDoubles = createDoubles(pf);
    const guards = createQuadruplets(pgDoubles, sgDoubles);
    // const forwards = createQuadruplets(sfDoubles, pfDoubles);
    // const allSquads = createSquads(guards, forwards, c);

    // Sort the squads in descending order of points accumulation projection
    // const sortedSquads = allSquads.sort(
    //   (a, b) => b.squadPoints - a.squadPoints
    // );
    // const someSquads = sortedSquads.slice(0, 5);
    console.log(guards);
    res.status(200).send('Calculation done');
  } catch (err) {
    res.status(404).send(err.message);
  }
});

// Create a player document
router.post('/player/create', async (req, res) => {
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
