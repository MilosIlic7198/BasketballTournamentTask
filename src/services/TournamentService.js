import IntegrationService from './IntegrationService.js';
import MatchService from './MatchService.js';

class TournamentService {
    constructor(groups, exibitions) {
        this.groups = new IntegrationService(groups, exibitions).integrateTeamStats();
    }

    simulateGroupStage() {
        let groupMatches = {};
        for (const group in this.groups) {
            groupMatches[group] = new MatchService(this.groups[group]).teamsMatchGenerator();
        }

        let rounds = {};
        for (const group in groupMatches) {
            const matchesData = groupMatches[group];

            for (let i = 0; i < matchesData.length; i++) {
                const { round, matches } = matchesData[i];
                if (!rounds[round]) {
                    rounds[round] = {};
                }
                rounds[round][group] = matches;
            }
        }

        for (const round in rounds) {
            console.log(`Group stage - ${round} round:`);
            for (const group in rounds[round]) {
                console.log(`    Group ${group}:`);
                const matches = rounds[round][group];

                for (let i = 0; i < matches.length; i++) {
                    const match = matches[i];
                    console.log(`        ${match}`);
                }
            }
            console.log();
        }
    }

    log() {
        console.log(this.groups);
        console.log('=================================================');
        console.log(this.groups.A[0].stats);
        console.log('=================================================');
        console.log(this.groups.A[0].opponents);
        console.log('=================================================');
        console.log(this.groups.A[0].exibitions);
        console.log('=================================================');
        console.log(this.groups.A[0].exibitions.USA);
    }
}

export default TournamentService;
