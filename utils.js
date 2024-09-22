export function getResult(teamScore, opponentScore) {
    if (teamScore > opponentScore) {
        return 'W';
    } else {
        return 'L';
    }
}
