class Team {
    constructor(teamData, exibitions) {
        this.ISOCode = teamData.ISOCode;
        this.Team = teamData.Team;
        this.FIBARanking = teamData.FIBARanking;
        this.exibitions = exibitions;
        this.stats = { wins: 0, losses: 0, points: 0, scored: 0, received: 0, difference: 0, withdraws: 0 };
        this.opponents = {};
    }

    calculateTeamForm() {
        let formScore = 0;
    
        const exibitionMatches = Object.values(this.exibitions).flat();
        const opponentMatches = Object.values(this.opponents).flatMap(opponent => opponent.matches);
        const allMatches = [...exibitionMatches, ...opponentMatches];
    
        allMatches.forEach(match => {
            if (match.teamScore > match.opponentScore) {
                formScore += 2;

                const scoreDifference = Math.abs(match.teamScore - match.opponentScore);
                if (scoreDifference > 20) {
                    formScore += 1;
                }
            } else {
                formScore += 1;
            }
        });
    
        return formScore;
    }

    updateTeamStats(teamScore, opponentScore, withdrew) {
        if (withdrew === 'A') {
            this.stats.losses++;
            this.stats.withdraws++;
        } else if (withdrew === 'B') {
            this.stats.wins++;
            this.stats.points += 2;
        } else {
            if (teamScore > opponentScore) {
                this.stats.wins++;
                this.stats.points += 2;
            } else {
                this.stats.losses++;
                this.stats.points += 1;
            }
        }
        this.stats.scored += teamScore;
        this.stats.received += opponentScore;
        this.stats.difference = this.stats.scored - this.stats.received;
    }

    updateOpponents(opponentISOCode, teamScore, opponentScore, stage) {
        if (!this.opponents[opponentISOCode]) {
            this.opponents[opponentISOCode] = { matches: [], matchCount: 0, stage: null };
        }
        this.opponents[opponentISOCode].stage = stage;
        ++this.opponents[opponentISOCode].matchCount;
        this.opponents[opponentISOCode].matches.push({ teamScore: teamScore, opponentScore: opponentScore, result: teamScore > opponentScore ? 'W' : 'L' });
    }
}

export default Team;
