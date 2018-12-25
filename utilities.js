const utilities = {};

utilities.parseVolume = (vol) => {
    if (!vol) return 1;
    if (vol === "doprava") {
        return 6;
    }

    if (isNaN(vol)) return 1;

    vol = vol / 100;

    if (vol > 6) {
        return 6;
    }

    return vol;
}

module.exports = utilities;