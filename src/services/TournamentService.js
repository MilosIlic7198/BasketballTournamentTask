import IntegrationService from './IntegrationService.js';

class TournamentService {
    constructor(groups, exibitions) {
        this.groups = new IntegrationService(groups, exibitions).integrateTeamStats();
    }

    simulateGroupStage() {
        console.log(this.groups.A[0].stats);
        console.log(this.groups.A[0].opponents);
        console.log(this.groups.A[0].opponents.USA);
    }
}

export default TournamentService;
