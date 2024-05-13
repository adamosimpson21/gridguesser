export const translateNumberToString = (numberToTranslate: number) => {
    switch (numberToTranslate) {
        case 1:
            return "ONE";
        case 2:
            return "TWO";
        case 3:
            return "THREE";
        case 4:
            return "FOUR";
        case 5:
            return "FIVE";
        case 6:
            return "SIX";
        case 7:
            return "SEVEN";
        case 8:
            return "EIGHT";
        case 9:
            return "NINE";
        case 0:
            return "ZERO";
        default:
            return "ZERO";
    }
};
