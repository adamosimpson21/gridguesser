import { flavorConstants } from "@/game/constants/flavorConstants";
import { AdvancedMechanic } from "@/game/GameState/gameConstants";

export const KEY_ITEMS: { [key: string]: keyItemType } = {
    REVEAL: {
        id: "REVEAL",
        name: "Reveal",
        description: "Reveals a spot",
    },
    FLAG: {
        id: "FLAG",
        name: "Caution",
        description: "Creates a caution sign",
    },
    QUERY: {
        id: "QUERY",
        name: "Curiosity",
        description: "Questions a spot",
    },
    REMOVE_TRASH: {
        id: "REMOVE_TRASH",
        name: "Remove Trash",
        description: "Clears a spot of trash",
        restrictions: AdvancedMechanic.fightCanHaveTrashTiles,
    },
    REMOVE_BOMB: {
        id: "REMOVE_BOMB",
        name: "Remove Dust Bunnies",
        description: `Use on a closed spot to eliminate a potential ${flavorConstants.ENEMY_NAME}`,
    },
    REMOVE_LIES: {
        id: "REMOVE_LIES",
        name: "Lie Detector",
        description: "Forces a 5x5 area to tell the truth",
        restrictions: AdvancedMechanic.fightCanHaveLyingTiles,
    },
    UMBRELLA: {
        id: "UMBRELLA",
        name: "Towel",
        description: `Reveals the number of ${flavorConstants.ENEMY_NAME_PLURAL} in a 3x3 area on any spot`,
    },
    TOWER: {
        id: "TOWER",
        name: "Stepstool",
        description: `Use on a revealed spot to learn the number of ${flavorConstants.ENEMY_NAME_PLURAL} in a 5x5 area`,
    },
    BLOCK: {
        id: "BLOCK",
        name: "Cement",
        description: `Covers a 2x2 area in cement, removing it from the ${flavorConstants.FIGHT_NAME}`,
    },
    PESTICIDE: {
        id: "PESTICIDE",
        name: "Pesticide",
        description: `Temporarily Removes Tentacles from a 5x5 Area`,
        restrictions: AdvancedMechanic.fightCanHaveTentacles,
    },
};

export type keyItemType = {
    id: string;
    name: string;
    description: string;
    restrictions?: AdvancedMechanic;
};
