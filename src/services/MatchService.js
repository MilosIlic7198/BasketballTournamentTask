import Match from "../models/Match.js";

class MatchService {
    constructor(teams) {
        this.teams = teams;
    }

    teamsMatchGenerator() {
        return this.teamsMatchmakerWithRoundRobin();
    }

    teamsMatchmakerWithRoundRobin() {
        const gamesByRound = [];
        const numTeams = this.teams.length;
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
                const match = new Match(this.teams[home], this.teams[away]).generateMatchResult();
                roundMatches.push(`${match.teamA.Team} - ${match.teamB.Team} (${match.teamAScore}:${match.teamBScore})`);
            }
            gamesByRound.push({
                round: round + 1,
                matches: roundMatches
            });
        }
        return gamesByRound;
    }
}

export default MatchService;
