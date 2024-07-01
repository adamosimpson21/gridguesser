import { GameState } from "@/game/GameState/GameState";
import { doXTimes } from "@/game/functions/doXTimes";

export const getNumByLuck = (num: number) => {
    let numSuccesses = 0;
    doXTimes(num, () => {
        console.log("luck check");
        if (Phaser.Math.FloatBetween(0, 1) < GameState.luck) {
            console.log("luck success");
            numSuccesses++;
        }
    });
    return numSuccesses;
};
