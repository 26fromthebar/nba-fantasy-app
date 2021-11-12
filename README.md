The current project was created by Kostas Christou (https://github.com/26fromthebar) and Christina Milona (https://github.com/cris-milona) and it is an attempt to create an NBA lineup optimizer that can be used in a particular NBA fantasy setup. The lineup must contain one center, two power forwards, two small forwards, two shooting guards and two point guards but cannot contain more than two players from the same NBA team. Every NBA player is given a salary and every user has a maximum budget to spend to acquire players.

The user provides a budget for the squad and the application generates all possible 9-player squads, listed from the best to the worst one, that do not exceed this budget.

Squad’s projected points are the sum of each player’s projected points over the next 20 days and the final sorting of the squads in based on that projection. The displayed results for each squad include:
    • names of players per position
    • total games over the next 20 days
    • squad’s budget
    • squad’s total projected points

In the source code we first minimize the players’ pool keeping the ones with the best average points per salary, then create doubles, quadruplets and 9-player squads applying the players per squad and budget limitations and we finally sort the results in a descending order. In the current state of the app we choose to display on screen only the first 18 squads.

Data passed in the database are checked and renewed regularly.

You can find this application deployed at https://nba-lineup-optimizer.herokuapp.com/
