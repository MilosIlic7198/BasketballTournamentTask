import IntegrationService from './IntegrationService.js';
import MatchService from './MatchService.js';

class TournamentService {
    static rankings = [];

    constructor(groups, exibitions) {
        this.groups = new IntegrationService(groups, exibitions).integrateTeamStats();
    }

    simulateGroupStage() {
        const rounds = {};
        for (const group in this.groups) {
            const groupMatches  = new MatchService(this.groups[group]).generateGroupMatches();

            groupMatches.forEach(({ round, matches }) => {
                if (!rounds[round]) {
                    rounds[round] = {};
                }
                rounds[round][group] = matches;
            });
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
        console.log("Final standings in groups:");
        for (const group in this.groups) {
            this.groups[group] = new MatchService(this.groups[group]).generateGroupStandings();
            console.log(`    Group ${group} (Name | Wins/Losses/Points/Points scored/Points received/Point difference):`);
            this.groups[group].forEach((team, index) => {
                console.log(`        ${index + 1}. ${team.Team} | ${team.stats.wins} / ${team.stats.losses} / ${team.stats.points} / ${team.stats.scored} / ${team.stats.received} / ${team.stats.difference}`);
            });
        }
        console.log();
    }

    rankTeams() {
        const topTeams = { 1: [], 2: [], 3: [] };
        
        for (const group in this.groups) {
            const teams =  this.groups[group];
            for (let i = 0; i < 3; i++) {
                topTeams[i + 1].push(teams[i]);
            }
        }

        for (const tier in topTeams) {
            const teams = topTeams[tier];
            teams.sort((a, b) => {
                if (a.stats.points !== b.stats.points) return b.stats.points - a.stats.points;
                if (a.stats.difference !== b.stats.difference) return b.stats.difference - a.stats.difference;
                return b.stats.scored - a.stats.scored;
            });
            teams.forEach((team, index) => {
                team.rank = (parseInt(tier) - 1) * 3 + index + 1;
                TournamentService.rankings.push(team);
            });
        }
        TournamentService.rankings.sort((a, b) => a.rank - b.rank);
    }

    log() {
        console.log('================================================= GROUPS =================================================');
        console.log(this.groups);
        console.log(`================================================= ` + this.groups.A[0].Team + ` =================================================`);
        console.log(this.groups.A[0].stats);
        console.log('================================================= OPPONENTS =================================================');
        for (const key in this.groups.A[0].opponents) {
            console.log(this.groups.A[0].opponents[key]);
            console.log(`================================================= ` + key + ` =================================================`);
        }
        console.log();
        console.log('================================================= EXIBITIONS =================================================');
        console.log(this.groups.A[0].exibitions);
        console.log('================================================= RANKINGS =================================================');
        console.log(TournamentService.rankings);
    }
}

export default TournamentService;
