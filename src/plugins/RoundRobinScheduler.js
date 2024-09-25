class RoundRobinScheduler {
    constructor(teams) {
        this.teams = teams;
    }

    generateSchedule() {
        const gamesByRound = [];
        const numTeams = this.teams.length;
        const numRounds = numTeams - 1;
        const matchesPerRound = numTeams / 2;

        for (let round = 0; round < numRounds; round++) {
            let roundMatches = [];
            
            for (let i = 0; i < matchesPerRound; i++) {
                let home = (round + i) % (numTeams - 1);
                let away = (numTeams - 1 - i + round) % (numTeams - 1);

                if (i === 0) {
                    away = numTeams - 1;
                }
                roundMatches.push({ home: this.teams[home], away: this.teams[away] });
            }
            gamesByRound.push({ round: round + 1, matches: roundMatches });
        }
        return gamesByRound;
    }
}

export default RoundRobinScheduler;
