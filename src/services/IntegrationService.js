import Team from '../models/Team.js';

import { getResult } from '../utils/Score.js';

class IntegrationService {
    constructor(groups, exibitions) {
        this.groups = groups;
        this.exibitions = exibitions;
    }

    integrateTeamStats() {
        for (const group in this.groups) {
            for (let i = 0; i < this.groups[group].length; i++) {
                this.groups[group][i] = this.initializeStats(this.groups[group][i]);
            }
        };
        return this.groups;
    }

    initializeStats(teamData) {
        return new Team(teamData, this.integrateExibitionsData(teamData.ISOCode));
    }

    integrateExibitionsData(teamISOCode) {
        const teamExibitionMatches = this.exibitions[teamISOCode] || [];
        const teamExibitions = {};

        teamExibitionMatches.forEach(match => {
            const opponent = match.Opponent;
            const [teamScore, opponentScore] = match.Result.split('-').map(Number);
            const result = getResult(teamScore, opponentScore);

            if (!teamExibitions[opponent]) {
                teamExibitions[opponent] = [];
            }

            teamExibitions[opponent].push({ teamScore, opponentScore, result });
        });

        return teamExibitions;
    }
}

export default IntegrationService;
