// Function for minimizing player pool based on their avPoints/price
const calculateBestPlayers = (playerPool, percentageOfPlayerPool) => {
  playerPool.forEach((player) => {
    let value = player.avPoints / player.price;
    player.value = parseFloat(value).toFixed(2);
  });

  const sortPlayers = playerPool.sort((a, b) => b.value - a.value);
  let playerCount = Math.round(sortPlayers.length * percentageOfPlayerPool);
  const players = sortPlayers.slice(0, playerCount);
  return players;
};

// Function for checking if a squad does not have more than two players from the same team
const isSquadValid = (squad) => {
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

// Function for creating doubles based on same position
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

// Function for creating quadruplets
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

// Function for creating nine-men squads
const createSquads = (arr1, arr2, arr3, budget) => {
  const squadsArr = [];
  arr1.forEach((item1) => {
    arr2.forEach((item2) => {
      arr3.forEach((item3) => {
        const squad = item1.concat(item2, item3);

        const squadLineup = squad.map((item) => item.name);
        const squadIds = squad.map((item) => item._id);
        const squadTeams = squad.map((item) => item.team);
        const squadPrice = squad.map((item) => item.price);
        const squadBudget = Number(
          parseFloat(
            squadPrice.reduce((previousValue, currentValue) => {
              return previousValue + currentValue;
            })
          ).toFixed(1)
        );
        const playerExtectedPoints = squad.map(
          (item) => item.avPoints * item.nextGames
        );
        const squadExpectedPoints = parseInt(
          playerExtectedPoints.reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
          })
        );
        const playerNextGames = squad.map((item) => item.nextGames);
        const squadNextGames = playerNextGames.reduce(
          (previousValue, currentValue) => {
            return previousValue + currentValue;
          }
        );

        if (isSquadValid(squadTeams) && squadBudget <= budget) {
          const squadObj = {
            squadLineup,
            squadIds,
            squadExpectedPoints,
            squadBudget,
            squadNextGames,
          };

          squadsArr.push(squadObj);
        }
      });
    });
  });

  const tallySquads = (array) => {
    let tallyArr = [];
    array.forEach((item) => {
      tallyArr = tallyArr.concat(...item.squadLineup);
    });
    return tallyArr.reduce((tally, val) => {
      tally[val] = (tally[val] || 0) + 1;
      return tally;
    }, {});
  };

  const playersTally = tallySquads(squadsArr);

  return { squadsArr, playersTally };
};

const createTeams = (pg, sg, sf, pf, c, budget) => {
  const pgDoubles = createDoubles(pg);
  const sgDoubles = createDoubles(sg);
  const sfDoubles = createDoubles(sf);
  const pfDoubles = createDoubles(pf);
  const guards = createQuadruplets(pgDoubles, sgDoubles);
  const forwards = createQuadruplets(sfDoubles, pfDoubles);
  const allSquads = createSquads(guards, forwards, c, budget);

  return allSquads;
};

module.exports = {
  calculateBestPlayers,
  createTeams,
};
