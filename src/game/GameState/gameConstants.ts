import { FIGHT_INPUT_TYPES } from "@/game/Fight/fightConstants";

export const GAME_CONSTANTS = {
    startingName: "Jan Eator",
    startingHp: 8,
    startingMaxHp: 8,
    startingGold: 5,
    startingLevel: 1,
    startingBombIntensity: 2,
    startingLuck: 0,
    startingBombNum: 5,
    startingFightGridWidth: 8,
    startingFightGridHeight: 8,
    startingOverworldGridWidth: 5,
    startingOverworldGridHeight: 5,
    startingOverworldShops: 2,
    startingOverworldFights: 6,
    startingOverworldBuffs: 1,
    startingOverworldTraps: 1,
    startingShopGridWidth: 3,
    startingShopGridHeight: 4,
    startingShopItemNumber: 6,
    startingFightGoldReward: 5,
    startingFightBossGoldReward: 5,
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
    startingRemoveTrashNum: 3,
    startingRemoveBombNum: 2,
    startingRemoveLyingNum: 2,
    startingUmbrellaNum: 2,
    startingTowerNum: 2,
    startingBlockNum: 1,
    startingTrashTileNum: 1,
    startingLyingTileNum: 1,
    startingUmbrellaSize: 3,
    startingBombCounterCanLiePercent: 5,
    startingTowerSize: 5,
    startingBlockSize: 2,
    advancedMechanics: [
        "fightCanHaveTrashTiles",
        "fightCanHaveLyingTiles",
        "fightCanHaveMultiBombTiles",
        // "bombCounterCanLie",
    ],
};

export const NAME_CHOICES = [
    "Jan Eator",
    "Cousteau Dian",
    "Han Demon",
    "May Tenance",
    "Dustin Buster",
];
