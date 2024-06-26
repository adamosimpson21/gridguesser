import { FIGHT_INPUT_TYPES } from "@/game/Fight/fightConstants";
import { GameState } from "@/game/GameState/GameState";

export const getInputUsesAvailable = (inputType: string) => {
    switch (inputType) {
        case FIGHT_INPUT_TYPES.REVEAL:
            return -1;
        case FIGHT_INPUT_TYPES.FLAG:
            return -1;
        case FIGHT_INPUT_TYPES.QUERY:
            return -1;
        case FIGHT_INPUT_TYPES.REMOVE_TRASH:
            return GameState.removeTrashNum;
        case FIGHT_INPUT_TYPES.REMOVE_BOMB:
            return GameState.removeBombNum;
        case FIGHT_INPUT_TYPES.REMOVE_LIES:
            return GameState.removeLyingNum;
        case FIGHT_INPUT_TYPES.UMBRELLA:
            return GameState.umbrellaNum;
        case FIGHT_INPUT_TYPES.TOWER:
            return GameState.towerNum;
        case FIGHT_INPUT_TYPES.BLOCK:
            return GameState.blockNum;
        case FIGHT_INPUT_TYPES.PESTICIDE:
            return GameState.pesticideNum;
        default:
            return -1;
    }
};

export const getInputInstanceUsesAvailable = (inputType: string) => {
    switch (inputType) {
        case FIGHT_INPUT_TYPES.REVEAL:
            return -1;
        case FIGHT_INPUT_TYPES.FLAG:
            return -1;
        case FIGHT_INPUT_TYPES.QUERY:
            return -1;
        case FIGHT_INPUT_TYPES.REMOVE_TRASH:
            return GameState.instanceRemoveTrashNum;
        case FIGHT_INPUT_TYPES.REMOVE_BOMB:
            return GameState.instanceRemoveBombNum;
        case FIGHT_INPUT_TYPES.REMOVE_LIES:
            return GameState.instanceRemoveLyingNum;
        case FIGHT_INPUT_TYPES.UMBRELLA:
            return GameState.instanceUmbrellaNum;
        case FIGHT_INPUT_TYPES.TOWER:
            return GameState.instanceTowerNum;
        case FIGHT_INPUT_TYPES.BLOCK:
            return GameState.instanceBlockNum;
        case FIGHT_INPUT_TYPES.PESTICIDE:
            return GameState.instancePesticideNum;
        default:
            return -1;
    }
};
