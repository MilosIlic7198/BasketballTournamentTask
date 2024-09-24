export function generateGroupMatchesWithRoundRobin(teams) {
    const matches = [];
    const numTeams = teams.length;
    const numRounds = numTeams - 1;
    const matchesPerRound =  numTeams / 2;

    for (let round = 0; round < numRounds; round++) {
        let roundMatches = [];
        for (let i = 0; i < matchesPerRound; i++) {

            let home = (round + i) % (numTeams - 1);
            let away = (numTeams - 1 - i + round) % (numTeams - 1);
            if (i === 0) {
                away = numTeams - 1;
            }
            roundMatches.push([teams[home], teams[away]]);
        }
        matches.push({
            round: round + 1,
            matches: roundMatches
        });
    }
    return matches;
}
