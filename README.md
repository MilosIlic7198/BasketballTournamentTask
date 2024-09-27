# Basketball Tournament Task

Write a JavaScript program to simulate a basketball tournament at the Olympic Games. You will need to simulate the group stage and the elimination stage of the tournament.
The task needs to be done using only JavaScript without the use of external packages.
The task is started with the command: npm start
Then it shows the tournament simulation in the std output.

The description of the task is given below...

## Group stage

Groups and teams are given in the groups.json file. Country name information, ISO-3166 codes, and FIBA ​​ranking prior to the start of the Olympic Games are provided there. 

It is necessary to simulate the result of all the matches of the group stage and finally to rank the teams within the group according to the propositions of the competition. Determine the results of the matches so that the probability of a team's victory and defeat is correlated with the difference in their positions in the FIBA ​​ranking. 

The group stage rules are: 

The group stage consists of each team playing with the remaining three teams from their group. 

Teams get: 

2 points to win, 

1 point for a loss, 

0 points for defeat by surrender. 

The teams within the group are ranked based on the number of points. 

In the event that two teams from the same group have the same number of points, the result of the mutual meeting will be used as a ranking criterion. 

In the event that 3 teams from the same group have the same number of points, the criteria for ranking will be the difference in points in mutual games between those 3 teams. 

At the end of the group stage, the first-placed, second-placed and third-placed teams from all groups are ranked from 1 to 9: 

The first-placed teams from groups A, B and C are ranked among themselves primarily by the number of points, then the score difference (in case of an equal number of points) and then the number of buckets scored (in the case of an equal number of points and score difference) in order to be assigned ranks 1 , 2 and 3. 

The second-placed teams from groups A, B and C are ranked among themselves according to the same principle in order to be assigned ranks 4, 5 and 6. 

The third-placed teams from groups A, B and C are ranked among themselves according to the same principle in order to be assigned ranks 7, 8 and 9. 

The teams ranked from 1 to 8 go to the elimination stage, the team ranked 9 does not continue the competition. 

In the output, show the results of all group stage matches by rounds, then the ranking by groups and which 8 teams have advanced. 

Example output (your display may be formatted differently, it doesn't have to be the same):

### Group stage - 1st Round:

#### Group A:
- Canada - Greece (85:79)
- Australia - Spain (92:80)

#### Group B:
- Germany - Japan (97:77)
- France - Brazil (78:66)

#### ---

### Final ranking in groups:

#### Group A (Name | Wins/Losses/Points/Points Scored/Points Received/Point Difference):
1. Canada | 3 / 0 / 6  / 267 / 247 / +20
2. Australia | 2 / 1 / 4  / 246 / 250 / -4
3. Greece | 2 / 1 / 4  / 233 / 241 / -8
4. Spain | 2 / 1 / 4  / 249 / 257 / -8

#### ---

## Qualification stage

The teams that qualified for the quarter-finals will be divided into four hats: 

Hat D: Teams ranked 1 and 2. 

Hat E: Teams ranked 3 and 4. 

Hat F: Teams ranked 5 and 6. 

Hat G: Teams ranked 7 and 8. 

Teams from Hat D are randomly paired with teams from Hat G, and teams from Hat E with teams from Hat F to form the quarter-final pairings. 
A very important proposition is that teams that played against each other in the group stage cannot meet in the quarter-finals.

After this, show the teams by hats and the final selection of the elimination stage.
Example output:

### Hats:
#### Hat D
- Germany
- USA

#### Hat E
- Serbia
- Canada

#### Hat F
- France
- Australia

#### Hat G
- Brazil
- Greece

### Elimination stage:
- France - Canada
- Germany - Greece

- USA - Brazil
- Serbia - Australia

## Elimination stage

The tournament continues with a standard elimination format, where the winners advance to the semi-finals and the losers are eliminated. 
The winners of the semi-finals go to the final, while the losers play for the bronze medal.

Show all elimination stage matches by round (quarter-finals, semi-finals, third place match, finals). 
After that, show the teams that won medals.

Example output:

### Quarter-finals:
- France - Canada (82: 73)
- Germany - Greece (76: 63)

- USA - Brazil (122: 87)
- Serbia - Australia (95: 90)

### Semi-finals:
- France - Germany (73: 69)
- USA - Serbia (95: 91)

### Third place match:
- Germany - Serbia (83: 93)

### Finals:
- France - USA (87: 98)

### Medals:
1. USA
2. France
3. Serbia

## Bonus

When determining the probability of the winner, take into account the form of the team. 
The starting point for this calculation can be the data from the file exibitions.json in which the results of 2 friendly matches for each team are given. 
The form can be calculated as the tournament progresses, and you can also include the strength of the opponent and the point difference that the team achieved as a form factor.
