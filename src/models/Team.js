class Team {
    constructor(teamData, exibitions) {
        this.ISOCode = teamData.ISOCode;
        this.Team = teamData.Team;
        this.FIBARanking = teamData.FIBARanking;
        this.exibitions = exibitions;
        this.stats = { wins: 0, losses: 0, points: 0, scored: 0, received: 0 };
        this.opponents = {};
    }
}

export default Team;
