import IntegrationService from './IntegrationService.js';
import MatchService from './MatchService.js';

class TournamentService {
    static rankings = [];

    constructor(groups, exibitions) {
        this.groups = new IntegrationService(groups, exibitions).integrateTeamStats();
    }

    simulateGroupStage() {
        let groupMatches = {};
        for (const group in this.groups) {
            groupMatches[group] = new MatchService(this.groups[group]).generateGroupMatches();
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

    simulateGroupStandings() {
        const groupStandings = {};
        
        for (const group in this.groups) {
            groupStandings[group] = new MatchService(this.groups[group]).generateGroupStandings();
        }

        console.log("Final standings in groups:");
        for (const group in groupStandings) {
            console.log(`    Group ${group} (Name | Wins/Losses/Points/Points scored/Points received/Point difference):`);
            groupStandings[group].forEach((team, index) => {
                console.log(`        ${index + 1}. ${team.Team} | ${team.stats.wins} / ${team.stats.losses} / ${team.stats.points} / ${team.stats.scored} / ${team.stats.received} / ${team.stats.difference}`);
            });
        }
        console.log();
    }

    log() {
        console.log(this.groups);
        console.log('=================================================');
        console.log(this.groups.A[0].stats);
        console.log('================================================= CANADA =================================================');
        console.log(this.groups.A[0].opponents);
        console.log('=================================================');
        console.log(this.groups.A[0].opponents.ESP);
        console.log('================================================= ESP =================================================');
        console.log(this.groups.A[0].opponents.GRE);
        console.log('================================================= GRE =================================================');
        console.log(this.groups.A[0].opponents.AUS);
        console.log('================================================= AUS =================================================');
        console.log(this.groups.A[0].exibitions);
        console.log('=================================================');
        console.log(this.groups.A[0].exibitions.USA);
        console.log('=================================================');
        console.log(TournamentService.rankings);
    }
}

export default TournamentService;
