import IntegrationService from './IntegrationService.js';
import MatchService from './MatchService.js';
import { shuffle } from '../utils/helpers.js';

class TournamentService {
    static rankings = [];

    constructor(groups, exibitions) {
        this.groups = new IntegrationService(groups, exibitions).integrateTeamStats();
        this.combinations = {};
        this.first;
        this.second;
        this.third;
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
            console.log(`    ${pair.teamA.Team} vs ${pair.teamB.Team}`);
        });
        console.log();
        this.combinations.pairsE_F.forEach(pair => {
            console.log(`    ${pair.teamA.Team} vs ${pair.teamB.Team}`);
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
            const teamA = hat1[index];
            const teamB = this.findEligibleTeam(hat2, teamA, pairedTeams, opponents, stage);
    
            if (teamB) {
                this.addPair(pairs, teamA, teamB, pairedTeams);
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

    findEligibleTeam(hat2, teamA, pairedTeams, opponents, stage) {
        for (const teamB of hat2) {
            if (pairedTeams.has(teamB.ISOCode)) continue;
    
            if (this.isEligible(teamA, teamB, opponents, stage)) {
                return teamB;
            }
        }
        return null;
    }
    
    isEligible(teamA, teamB, opponents, stage) {
        if (stage === 'qualification') {
            return !opponents[teamA.ISOCode] || 
                   !opponents[teamA.ISOCode][teamB.ISOCode] || 
                   opponents[teamA.ISOCode][teamB.ISOCode].stage !== 'group';
        }
        return true;
    }

    addPair(pairs, teamA, teamB, pairedTeams) {
        pairs.push({ teamA, teamB });
        pairedTeams.add(teamA.ISOCode);
        pairedTeams.add(teamB.ISOCode);
    }

    simulateKnockoutStage() {
        const winnersFromPairsD_G = [];
        const winnersFromPairsE_F = [];
        
        const quarterfinalsMatches_D_G = [];
        const quarterfinalsMatches_E_F = [];
        
        this.combinations.pairsD_G.forEach(pair => {
            const pairToArray = Object.values(pair);
            const match = new MatchService(pairToArray).generateKnockoutMatches();
            quarterfinalsMatches_D_G.push(`${match.teamA.Team} - ${match.teamB.Team} (${match.teamAScore}:${match.teamBScore})`);
            winnersFromPairsD_G.push(match.teamAScore > match.teamBScore ? match.teamA : match.teamB);
        });

        this.combinations.pairsE_F.forEach(pair => {
            const pairToArray = Object.values(pair);
            const match = new MatchService(pairToArray).generateKnockoutMatches();
            quarterfinalsMatches_E_F.push(`${match.teamA.Team} - ${match.teamB.Team} (${match.teamAScore}:${match.teamBScore})`);
            winnersFromPairsE_F.push(match.teamAScore > match.teamBScore ? match.teamA : match.teamB);
        });

        console.log();
        console.log('Quarter-finals:');
        for (let i = 0; i < quarterfinalsMatches_D_G.length; i++) {
            const match = quarterfinalsMatches_D_G[i];
            console.log(`        ${match}`);
        }
        
        console.log();
        for (let i = 0; i < quarterfinalsMatches_E_F.length; i++) {
            const match = quarterfinalsMatches_E_F[i];
            console.log(`        ${match}`);
        }

        const semifinalPairs = this.randomPair(winnersFromPairsD_G, winnersFromPairsE_F, null, 'knockout');

        const semifinalWinners = {};
        const semifinalMatches = [];
        
        const thirdPlacePair = {};
        
        semifinalPairs.forEach((pair, index) => {
            const pairToArray = Object.values(pair);
            const match = new MatchService(pairToArray).generateKnockoutMatches();
            semifinalMatches.push(`${match.teamA.Team} - ${match.teamB.Team} (${match.teamAScore}:${match.teamBScore})`);
            semifinalWinners[index === 0 ? 'teamA' : 'teamB'] = match.teamAScore > match.teamBScore ? match.teamA : match.teamB;
            thirdPlacePair[index === 0 ? 'teamA' : 'teamB'] = match.teamAScore > match.teamBScore ? match.teamB : match.teamA;
        });
        
        console.log('Semi-finals:');
        for (let i = 0; i < semifinalMatches.length; i++) {
            const match = semifinalMatches[i];
            console.log(`        ${match}`);
        }
        
        let thirdPlaceWinner;
        
        const thirdPlaceToArray = Object.values(thirdPlacePair);
        const thirdPlaceMatch = new MatchService(thirdPlaceToArray).generateKnockoutMatches();
        thirdPlaceWinner = thirdPlaceMatch.teamAScore > thirdPlaceMatch.teamBScore ? thirdPlaceMatch.teamA : thirdPlaceMatch.teamB;

        console.log('Third place match:');
        console.log(`        ${thirdPlaceMatch.teamA.Team} - ${thirdPlaceMatch.teamB.Team} (${thirdPlaceMatch.teamAScore}:${thirdPlaceMatch.teamBScore})`);
        
        let finalsWinner;
        let secondPlaceWinner;
        
        const finalsPair = { teamA: semifinalWinners.teamA, teamB: semifinalWinners.teamB};

        const finalsPairToArray = Object.values(finalsPair);
        const finalsMatch = new MatchService(finalsPairToArray).generateKnockoutMatches();
        finalsWinner =  finalsMatch.teamAScore > finalsMatch.teamBScore ? finalsMatch.teamA : finalsMatch.teamB;
        secondPlaceWinner = finalsMatch.teamAScore > finalsMatch.teamBScore ? finalsMatch.teamB : finalsMatch.teamA;
        
        console.log('Finals:');
        console.log(`        ${finalsMatch.teamA.Team} - ${finalsMatch.teamB.Team} (${finalsMatch.teamAScore}:${finalsMatch.teamBScore})`);
        
        console.log('Medals:')
        console.log(`        1. ${finalsWinner.Team}`);
        console.log(`        2. ${secondPlaceWinner.Team}`);
        console.log(`        3. ${thirdPlaceWinner.Team}`);
        console.log();

        this.first = finalsWinner;
        this.second = secondPlaceWinner;
        this.third = thirdPlaceWinner;
    }

    log() {
        console.log('================================================= GROUPS =================================================');
        console.log(this.groups);

        console.log();
        console.log();

        console.log(`================================================= ` + this.groups.A[0].Team + ` =================================================`);
        console.log(this.groups.A[0].stats);
        console.log('================================================= OPPONENTS =================================================');
        for (const key in this.groups.A[0].opponents) {
            console.log(this.groups.A[0].opponents[key]);
            console.log(`================================================= ` + key + ` =================================================`);
        }
        console.log('================================================= EXIBITIONS =================================================');
        console.log(this.groups.A[0].exibitions);

        console.log();
        console.log();

        console.log('================================================= RANKINGS =================================================');
        console.log(TournamentService.rankings);

        console.log();
        console.log();
        console.log();

        console.log(`================================================= ` + this.first.Team + ` OPPONENTS =================================================`);
        for (const key in this.first.opponents) {
            console.log(this.first.opponents[key]);
            console.log(`================================================= ` + key + ` =================================================`);
        }
        console.log(`================================================= ` + this.second.Team + ` OPPONENTS =================================================`);
        for (const key in this.second.opponents) {
            console.log(this.second.opponents[key]);
            console.log(`================================================= ` + key + ` =================================================`);
        }
        console.log(`================================================= ` + this.third.Team + ` OPPONENTS =================================================`);
        for (const key in this.third.opponents) {
            console.log(this.third.opponents[key]);
            console.log(`================================================= ` + key + ` =================================================`);
        }
    }
}

export default TournamentService;
