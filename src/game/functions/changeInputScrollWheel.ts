import { GameState } from "@/game/GameState/GameState";
import { EventBus } from "@/game/EventBus/EventBus";
import { FIGHT_EVENTS } from "@/game/EventBus/events";
import { getInputInstanceUsesAvailable } from "@/game/functions/getInputUsesAvailable";

export const changeInputScrollWheel = (
    pointer: Phaser.Input.Pointer,
    deltaX: number,
    deltaY: number,
) => {
    // change input on scroll down
    const currentIndex = GameState.fightInputTypes.indexOf(
        GameState.currentFightInputType,
    );
    let nextIndex = currentIndex;
    let resolved = false;
    do {
        if (deltaY > 0) {
            // end of list
            if (nextIndex === GameState.fightInputTypes.length - 1) {
                nextIndex = 0;
            } else {
                nextIndex++;
            }
        } else {
            // beginning going backwards
            if (nextIndex === 0) {
                nextIndex = GameState.fightInputTypes.length - 1;
            } else {
                nextIndex--;
            }
        }
        if (
            getInputInstanceUsesAvailable(
                GameState.fightInputTypes[nextIndex],
            ) != 0
        ) {
            EventBus.emit(
                FIGHT_EVENTS.CHANGE_INPUT_TYPE,
                GameState.fightInputTypes[nextIndex],
            );
            resolved = true;
        }
    } while (!resolved);
};
