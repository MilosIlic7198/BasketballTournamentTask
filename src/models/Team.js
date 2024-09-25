class Team {
    constructor(teamData, exibitions) {
        this.ISOCode = teamData.ISOCode;
        this.Team = teamData.Team;
        this.FIBARanking = teamData.FIBARanking;
        this.exibitions = exibitions;
        this.stats = { wins: 0, losses: 0, points: 0, scored: 0, received: 0, withdraws: 0 };
        this.opponents = {};
    }

    calculateTeamForm() {
        let formScore = 0;
    
        const exibitionMatches = Object.values(this.exibitions).flat();
        const opponentMatches = Object.values(this.opponents).flatMap(opponent => opponent.matches);
        const allMatches = [...exibitionMatches, ...opponentMatches];
    
        allMatches.forEach(match => {
            if (match.teamScore > match.opponentScore) {
                formScore += 2;

                const scoreDifference = Math.abs(match.teamScore - match.opponentScore);
                if (scoreDifference > 20) {
                    formScore += 1;
                }
            } else {
                formScore += 1;
            }
        });
    
        return formScore;
    }
}

export default Team;
