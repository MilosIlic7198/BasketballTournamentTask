import { getResult } from '../utils/Score.js';

class IntegrationService {
    constructor(groups, exibitions) {
        this.groups = groups;
        this.exibitions = exibitions;
    }

    integrateTeamStats() {
        for (const group in this.groups) {
            for (const team of this.groups[group]) {
                this.initializeStats(team);
            };
        };
        return this.groups;
    }

    initializeStats(team) {
        team.stats = { wins: 0, losses: 0, points: 0, scored: 0, received: 0 };
        team.opponents = this.integrateExibitionsData(team.ISOCode);
    }

    integrateExibitionsData(teamISOCode) {
        const exibitionMatches = this.exibitions[teamISOCode] || [];
        const matches = {};

        exibitionMatches.forEach(match => {
            const opponent = match.Opponent;
            const [teamScore, opponentScore] = match.Result.split('-').map(Number);
            const result = getResult(teamScore, opponentScore);

            if (!matches[opponent]) {
                matches[opponent] = { matches: [], matchCount: 0, stage: 'exibition' };
            }

            matches[opponent].matches.push({ teamScore, opponentScore, result });
            matches[opponent].matchCount += 1;
        });

        return matches;
    }
}

export default IntegrationService;
