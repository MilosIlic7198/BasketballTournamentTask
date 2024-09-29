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

export function shuffle(hat) {
    for (let i = hat.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [hat[i], hat[j]] = [hat[j], hat[i]];
    }
    return hat;
};
