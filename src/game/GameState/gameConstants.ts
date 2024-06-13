import { FIGHT_INPUT_TYPES } from "@/game/Fight/fightConstants";
import { shopItemType } from "@/game/Shop/shopItems";

export const GAME_CONSTANTS = {
    startingCharacter: "CHAR_ONE",
    startingHp: 12,
    startingMaxHp: 12,
    startingGold: 15,
    startingLevel: 1,
    startingBombIntensity: 2,
    startingLuck: 0,
    startingInitialClickSize: 1,
    startingBombNum: 4,
    startingFightGridWidth: 8,
    startingFightGridHeight: 8,
    startingBossFightGridChange: 3,
    startingBossFightBombChange: 10,
    startingOverworldGridWidth: 5,
    startingOverworldGridHeight: 5,
    startingOverworldShops: 3,
    startingOverworldFights: 7,
    startingOverworldBuffs: 2,
    startingOverworldTraps: 0,
    startingShopGridWidth: 3,
    startingShopGridHeight: 4,
    startingShopItemNumber: 6,
    startingFightGoldReward: 5,
    startingFightBossGoldReward: 10,
    startingFightFlawlessGoldReward: 3,
    startingFightBombNumIncrement: 2,
    endLevel: 5,
    startingFightInputTypes: [
        FIGHT_INPUT_TYPES.REVEAL,
        FIGHT_INPUT_TYPES.FLAG,
        FIGHT_INPUT_TYPES.QUERY,
        // FIGHT_INPUT_TYPES.REMOVE_TRASH,
        // FIGHT_INPUT_TYPES.REMOVE_BOMB,
        // FIGHT_INPUT_TYPES.REMOVE_LIES,
        // FIGHT_INPUT_TYPES.UMBRELLA,
        // FIGHT_INPUT_TYPES.TOWER,
        // FIGHT_INPUT_TYPES.BLOCK,
    ],
    startingTrustedNumbers: [],
    startingRemoveTrashNum: 3,
    startingRemoveBombNum: 2,
    startingRemoveLyingNum: 2,
    startingUmbrellaNum: 2,
    startingTowerNum: 2,
    startingBlockNum: 1,
    startingTentacleNum: 1,
    startingTrashTileNum: 1,
    startingLyingTileNum: 2,
    startingUmbrellaSize: 3,
    startingBombCounterCanLiePercent: 5,
    startingTowerSize: 5,
    startingBlockSize: 2,
    advancedMechanics: [
        "fightCanHaveTrashTiles",
        "fightCanHaveLyingTiles",
        "fightCanHaveMultiBombTiles",
        "fightCanHaveTentacles",
        // "bombCounterCanLie",
    ],
};

export const CHARACTER_CHOICES: { [key: string]: characterType } = {
    CHAR_ONE: {
        id: "CHAR_ONE",
        name: "Jan Eator",
        imageFrame: 3,
        specialPower: {
            name: "Average",
            description: "Just your average sweeper",
        },
        unlocked: true,
    },
    CHAR_SIX: {
        id: "CHAR_SIX",
        name: "Broom Hilda",
        imageFrame: 4,
        specialPower: {
            name: "Sturdy",
            description:
                "Takes less Damage and has slightly more life, but offices are smaller",
        },
        unlocked: true,
    },
    CHAR_SEVEN: {
        id: "CHAR_SEVEN",
        name: "Dustin Buster",
        imageFrame: 5,
        specialPower: {
            name: "Dyscalculia",
            description: "Has a hard time reading numbers",
        },
        unlocked: true,
    },
    CHAR_TWO: {
        id: "CHAR_TWO",
        name: "Cousteau Dian",
        imageFrame: 6,
        specialPower: {
            name: "Nest Egg",
            description:
                "Gains a special item, Nest Egg. Nest Egg secretly accumulates a cache of random items. Use it once to gain the items",
        },
        unlocked: false,
    },
    CHAR_THREE: {
        id: "CHAR_THREE",
        name: "May Tenance",
        imageFrame: 7,
        specialPower: {
            name: "Klutz",
            description:
                "Gains more money per office, but has a tendency to slip and drop things",
        },
        unlocked: false,
    },
    CHAR_FOUR: {
        id: "CHAR_FOUR",
        name: "Dyson Hoover",
        imageFrame: 2,
        specialPower: {
            name: "Dust Suck",
            description:
                "Gains the Dust Suck Key, with infinite uses. Dust suck reveals a tile and removes dust bunnies on it at the cost of 1 life per bunny. Regain all of this life when the office is cleaned",
        },
        unlocked: false,
    },
    CHAR_FIVE: {
        id: "CHAR_FIVE",
        name: "Han Demon",
        imageFrame: 8,
        specialPower: {
            name: "Agent of Chaos",
            description:
                "The spiritual realm trembles at his presence, but has no use for worldly goods.",
        },
        unlocked: false,
    },
    CHAR_EIGHT: {
        id: "CHAR_EIGHT",
        name: "Jimny Sweep",
        imageFrame: 10,
        specialPower: {
            name: "????",
            description: "???????",
        },
        unlocked: false,
    },
};

export type characterType = {
    id: string;
    name: string;
    imageFrame: number;
    specialPower?: any;
    unlocked: boolean;
};
