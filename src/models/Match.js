import { roundUpToADecimal } from '../utils/helpers.js';

class Match {
    constructor(teamA, teamB) {
        this.teamA = teamA;
        this.teamB = teamB;
        this.teamAScore = null;
        this.teamBScore = null;
        this.withdrew = null;
    }

    generateMatchResult() {
        const formA = this.teamA.calculateTeamForm();
        const formB = this.teamB.calculateTeamForm();

        let scoreA, scoreB;
    
        const result = this.determineTheWinner(this.teamA.FIBARanking, this.teamB.FIBARanking, formA, formB);
        if (result === 'A') {
            scoreB = Math.floor(Math.random() * 40) + 50;
            scoreA = scoreB + Math.floor(Math.random() * 20) + 15;
        } else {
            scoreA = Math.floor(Math.random() * 40) + 50;
            scoreB = scoreA + Math.floor(Math.random() * 20) + 15;
        }
    
        let withdrew = null;
        const scoreDifference = Math.abs(scoreA - scoreB);
        const withdrawalChance = 0.5;
    
        if (scoreDifference > 30) {
            if (Math.random() < withdrawalChance) {
                if (scoreA > scoreB) {
                    withdrew = 'B';
                } else {
                    withdrew = 'A';
                }
            }
        }
        this.teamAScore = scoreA;
        this.teamBScore = scoreB;
        this.withdrew = withdrew;
        return this;
    }

    determineTheWinner(rankingA, rankingB, formA, formB) {
        const probability = this.calculateWinProbability(rankingA, rankingB, formA, formB);
        if (probability === 0.5) {
            return Math.random() > 0.5 ? 'A' : 'B';
        }
        return probability > 0.5 ? 'A' : 'B';
    }

    calculateWinProbability(rankingA, rankingB, formA, formB) {
        const difference = rankingB - rankingA;
        let probability = 1 / (1 + Math.exp(difference * 0.1));
        
        const formDifference = formB - formA;
        probability += formDifference * 0.5;
    
        probability = Math.max(0, Math.min(1, probability));
        const roundedUpProbability = roundUpToADecimal(probability, 1);
    
        return roundedUpProbability;
    }
}

export default Match;
