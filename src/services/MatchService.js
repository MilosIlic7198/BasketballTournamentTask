import RoundRobinScheduler from "../plugins/RoundRobinScheduler.js";
import Match from "../models/Match.js";

class MatchService {
    constructor(teams) {
        this.teams = teams;
        this.scheduler = new RoundRobinScheduler(teams);
    }

    generateGroupMatches() {
        const gamesByRound = this.scheduler.generateSchedule();
        return gamesByRound.map(round => {

            const matches = round.matches.map(match => {
                const matchInstance = new Match(match.home, match.away);
                const result = matchInstance.generateMatchResult('group');

                return `${result.teamA.Team} - ${result.teamB.Team} (${result.teamAScore}:${result.teamBScore})`;
            });
            return { round: round.round, matches };
        });
    }
}

export default MatchService;
