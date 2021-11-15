// DOM elements
const findSquadsBtn = document.querySelector('[data-btn-find-squads]');
const budgetInput = document.getElementById('input-budget');
const main = document.querySelector('[data-container]');

// Find squads
if (findSquadsBtn) {
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
      <div class="squad-players">
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
      </div>
      <div class="squad-info">
      <abbr class="abbriviation" title="Upcoming games">
        <img src="img/flaticon/001-basket-ball.png" alt="Upcoming games"></img>
      </abbr>
      <p class="games">${obj.squadNextGames}</p>
      <abbr class="abbriviation" title="Budget">
        <img src="img/flaticon/002-money-bag.png" alt="Budget"></img>
      </abbr>  
        <p class="budget">${obj.squadBudget}</p>
      <abbr class="abbriviation" title="Expected points">
        <img src="img/flaticon/004-stats.png" alt="Expected points"></img>
      </abbr>    
        <p class="points">${obj.squadExpectedPoints}</p>
      </div>
    `;

      div.innerHTML = html;
      resultsSection.append(div);
    });
  });
}
