import { getResult } from "./utils.js";

export function initializeTeamStats(groups, exibitions) {
    for (const group in groups) {
        for (const team of groups[group]) {
            team.stats = { wins: 0, losses: 0, points: 0, scored: 0, received: 0 };
            team.opponents = integrateExhibitionsData(team.ISOCode, exibitions);
        }
    }
}

function integrateExhibitionsData(teamISOCode, exibitions) {
    const exebitionMatches = exibitions[teamISOCode];
    let matches = {};
    for (let i = 0; i < exebitionMatches.length; i++) {
        const match = exebitionMatches[i];
        const opponent = match.Opponent;
        const [teamScore, opponentScore] = match.Result.split('-').map(Number);
        const result = getResult(teamScore, opponentScore);
        if (!matches[opponent]) {
            matches[opponent] = { matches: [], matchCount: 0, stage: 'exibition' };
        }
        matches[opponent].matches.push({ teamScore, opponentScore, result });
        matches[opponent].matchCount += 1;
    }
    return matches;
}
