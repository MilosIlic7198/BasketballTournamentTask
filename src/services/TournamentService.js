import IntegrationService from './IntegrationService.js';
import { generateGroupMatchesWithRoundRobin} from '../utils/Matchmaker.js';

class TournamentService {
    constructor(groups, exibitions) {
        this.groups = new IntegrationService(groups, exibitions).integrateTeamStats();
    }

    simulateGroupStage() {
        let groupMatches = {};
        for (const group in this.groups) {
            const teams = this.groups[group];
            groupMatches[group] = generateGroupMatchesWithRoundRobin(teams);
        }
        console.log(groupMatches.A[0].matches);
        console.log('=================================================');
        console.log(groupMatches.A[1].matches);
        console.log('=================================================');
        console.log(groupMatches.A[2].matches);
        console.log('=================================================');
    }

    log() {
        console.log(this.groups);
        console.log('=================================================');
        console.log(this.groups.A[0].stats);
        console.log('=================================================');
        console.log(this.groups.A[0].opponents);
        console.log('=================================================');
        console.log(this.groups.A[0].exibitions.USA);
    }
}

export default TournamentService;
