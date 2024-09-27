import RoundRobinScheduler from "../plugins/RoundRobinScheduler.js";
import Match from "../models/Match.js";

class MatchService {
    constructor(teams) {
        this.teams = teams;
    }

    generateGroupMatches() {
        const gamesByRound = new RoundRobinScheduler(this.teams).generateSchedule();
        return gamesByRound.map(round => {

            const matches = round.matches.map(match => {
                const matchInstance = new Match(match.home, match.away);
                const result = matchInstance.generateMatchResult('group');

                return `${result.teamA.Team} - ${result.teamB.Team} (${result.teamAScore}:${result.teamBScore})`;
            });
            return { round: round.round, matches };
        });
    }

    generateGroupStandings() {
        const teams = [...this.teams];
        teams.sort((a, b) => {
            if (a.stats.points !== b.stats.points) return b.stats.points - a.stats.points;
            const tiedTeams = teams.filter(team => team.stats.points === a.stats.points);

            if(tiedTeams.length === 2) {
                const opponentData = tiedTeams[0].opponents[tiedTeams[1].ISOCode];

                if(opponentData.stage === 'group') {
                    const match = opponentData.matches[opponentData.matchCount - 1];
                    return -(match.opponentScore - match.teamScore);
                }
            }
            return 0;
        });
        return teams;
    }
}

export default MatchService;
