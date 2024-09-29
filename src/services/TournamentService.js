import IntegrationService from './IntegrationService.js';
import MatchService from './MatchService.js';
import { shuffle } from '../utils/helpers.js';

class TournamentService {
    static rankings = [];

    constructor(groups, exibitions) {
        this.groups = new IntegrationService(groups, exibitions).integrateTeamStats();
        this.combinations = {};
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

    simulateQualificationStage() {
        const hats = this.createHats();

        console.log("Hats:");
        for (const hat in hats) {
            const teams = hats[hat];
            console.log(`    Hat ${hat}`);
            teams.forEach(team => console.log(`        ${team.Team}`));
        }
        
        const opponents = this.getOpponents();
        this.combinations.pairsD_G = this.randomPair(hats.D, hats.G, opponents, 'qualification');
        this.combinations.pairsE_F = this.randomPair(hats.E, hats.F, opponents, 'qualification');

        console.log();
        console.log("Elimination stage:");
        this.combinations.pairsD_G.forEach(pair => {
            console.log(`    ${pair.team1.Team} vs ${pair.team2.Team}`);
        });
        console.log();
        this.combinations.pairsE_F.forEach(pair => {
            console.log(`    ${pair.team1.Team} vs ${pair.team2.Team}`);
        });
    }

    createHats() {
        return {
            D: TournamentService.rankings.filter(t => t.rank <= 2),
            E: TournamentService.rankings.filter(t => t.rank >= 3 && t.rank <= 4),
            F: TournamentService.rankings.filter(t => t.rank >= 5 && t.rank <= 6),
            G: TournamentService.rankings.filter(t => t.rank >= 7 && t.rank <= 8),
        };
    }

    getOpponents() {
        const opponents = {};
        TournamentService.rankings.forEach(team => {
            opponents[team.ISOCode] = team.opponents;
        });
        return opponents;
    }

    randomPair(hat1, hat2, opponents = null, stage = null) {
        let pairs = [];
        hat1 = shuffle(hat1);
        hat2 = shuffle(hat2);
    
        let index = 0;
        const pairedTeams = new Set();
    
        while (pairs.length < 2  && index < hat1.length) {
            const team1 = hat1[index];
            const team2 = this.findEligibleTeam(hat2, team1, pairedTeams, opponents, stage);
    
            if (team2) {
                this.addPair(pairs, team1, team2, pairedTeams);
                index++;
            } else {
                hat2 = shuffle(hat2);
                index = 0;
                pairs = [];
                pairedTeams.clear();
            }
        }
        return pairs;
    };

    findEligibleTeam(hat2, team1, pairedTeams, opponents, stage) {
        for (const team2 of hat2) {
            if (pairedTeams.has(team2.ISOCode)) continue;
    
            if (this.isEligible(team1, team2, opponents, stage)) {
                return team2;
            }
        }
        return null;
    }
    
    isEligible(team1, team2, opponents, stage) {
        if (stage === 'qualification') {
            return !opponents[team1.ISOCode] || 
                   !opponents[team1.ISOCode][team2.ISOCode] || 
                   opponents[team1.ISOCode][team2.ISOCode].stage !== 'group';
        }
        return true;
    }

    addPair(pairs, team1, team2, pairedTeams) {
        pairs.push({ team1, team2 });
        pairedTeams.add(team1.ISOCode);
        pairedTeams.add(team2.ISOCode);
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
