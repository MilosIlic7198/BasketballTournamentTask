import IntegrationService from './IntegrationService.js';

class TournamentService {
    constructor(groups, exibitions) {
        this.groups = new IntegrationService(groups, exibitions).integrateTeamStats();
    }

    simulateGroupStage() {
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
