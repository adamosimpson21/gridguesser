import { GameState } from "@/game/classes/GameState";
import { EventBus } from "@/game/EventBus";
import { FIGHT_EVENTS } from "@/game/types/events";

export const changeInputScrollWheel = (
    pointer: Phaser.Input.Pointer,
    deltaX: number,
    deltaY: number,
) => {
    // change input on scroll down
    if (deltaY > 0) {
        const currentIndex = GameState.fightInputTypes.indexOf(
            GameState.currentFightInputType,
        );
        // end of list
        if (currentIndex === GameState.fightInputTypes.length - 1) {
            EventBus.emit(
                FIGHT_EVENTS.CHANGE_INPUT_TYPE,
                GameState.fightInputTypes[0],
            );
        } else {
            EventBus.emit(
                FIGHT_EVENTS.CHANGE_INPUT_TYPE,
                GameState.fightInputTypes[currentIndex + 1],
            );
        }
    } else {
        const currentIndex = GameState.fightInputTypes.indexOf(
            GameState.currentFightInputType,
        );
        //scroll up

        if (currentIndex === 0) {
            EventBus.emit(
                FIGHT_EVENTS.CHANGE_INPUT_TYPE,
                GameState.fightInputTypes[GameState.fightInputTypes.length - 1],
            );
        } else {
            EventBus.emit(
                FIGHT_EVENTS.CHANGE_INPUT_TYPE,
                GameState.fightInputTypes[currentIndex - 1],
            );
        }
    }
};
