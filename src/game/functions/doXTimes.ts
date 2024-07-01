export const doXTimes = (num: number, callback: () => void) => {
    do {
        callback();
        num--;
    } while (num > 0);
};
