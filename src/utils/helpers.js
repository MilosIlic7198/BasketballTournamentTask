export function getResult(teamScore, opponentScore) {
    if (teamScore > opponentScore) {
        return 'W';
    } else {
        return 'L';
    }
}

export function roundUpToADecimal(number, decimalPlaces) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.ceil(number * factor) / factor;
}
