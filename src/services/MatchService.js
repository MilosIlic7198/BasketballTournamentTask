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

            if (tiedTeams.length === 3) {
                const sortedTiedTeams = this.tiebreaker(tiedTeams);

                return sortedTiedTeams.findIndex(team => team.ISOCode === a.ISOCode) - sortedTiedTeams.findIndex(team => team.ISOCode === b.ISOCode);
            }
            return 0;
        });
        return teams;
    }

    tiebreaker(teams) {
        const opponentMap = teams.reduce((map, team) => {
            map[team.ISOCode] = team.opponents;
            return map;
        }, {});
    
        const countriesToKeep = Object.keys(opponentMap);
        const filteredData = {};

        countriesToKeep.forEach(country => {
            if (opponentMap[country]) {
                filteredData[country] = {};
                for (const [key, value] of Object.entries(opponentMap[country])) {
                    if (countriesToKeep.includes(key)) {
                        filteredData[country][key] = value;
                    }
                }
            }
        });

        const teamScores = {};
        const teamReceivedScores = {};

        for (const team in filteredData) {
            teamScores[team] = 0;
            teamReceivedScores[team] = 0;
            for (const opponent in filteredData[team]) {
                const match = filteredData[team][opponent].matches[filteredData[team][opponent].matchCount - 1];
                teamScores[team] += match.teamScore;
                teamReceivedScores[team] += match.opponentScore;
            }

            const totalDifference = teamScores[team] - teamReceivedScores[team];
            teamScores[team] = totalDifference;
        }
        return teams.sort((a, b) => teamScores[b.ISOCode] - teamScores[a.ISOCode]);
    }
}

export default MatchService;
