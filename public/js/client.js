// DOM elements
const findSquadsBtn = document.querySelector('[data-btn-find-squads]');
const budgetInput = document.getElementById('input-budget');
const main = document.querySelector('[data-container]');

// Find squads
findSquadsBtn.addEventListener('click', async (e) => {
  if (document.querySelector('.results')) {
    document.querySelector('.results').remove();
  }
  let budget = budgetInput.value;
  const response = await axios.post('/squads', { budget });

  const resultsSection = document.createElement('section');
  resultsSection.classList.add('results');
  main.append(resultsSection);

  response.data.forEach((obj) => {
    const div = document.createElement('div');
    div.classList.add('squad-card');

    const html = `
      <p class="position position--pg">pg</p>
      <p class="players players--pg">${obj.squadLineup[0]}, ${obj.squadLineup[1]}</p>
      <p class="position position--sg">sg</p>
      <p class="players players--sg">${obj.squadLineup[2]}, ${obj.squadLineup[3]}</p>
      <p class="position position--sf">sf</p>
      <p class="players players--sf">${obj.squadLineup[4]}, ${obj.squadLineup[5]}</p>
      <p class="position position--pf">pf</p>
      <p class="players players--pf">${obj.squadLineup[6]}, ${obj.squadLineup[7]}</p>
      <p class="position position--c">c</p>
      <p class="players players--c">${obj.squadLineup[8]}</p>
      <p class="squad-info budget">Budget: <span>${obj.squadBudget}</span></p>
      <p class="squad-info points">Expected points: <span>${obj.squadExpectedPoints}</span></p>
      <p class="squad-info games">Upcoming games: <span>${obj.squadNextGames}</span></p>
    `;

    div.innerHTML = html;
    resultsSection.append(div);
  });
});
