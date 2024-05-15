import { FIGHT_INPUT_TYPES } from "@/game/types/fightConstants";

export const GAME_CONSTANTS = {
    startingHp: 5,
    startingMaxHp: 5,
    startingGold: 5,
    startingLevel: 1,
    startingBombIntensity: 2,
    startingLuck: 0,
    startingName: "Jan Eator",
    startingBombNum: 14,
    startingFightGridWidth: 8,
    startingFightGridHeight: 8,
    startingOverworldGridWidth: 5,
    startingOverworldGridHeight: 5,
    startingOverworldShops: 2,
    startingOverworldFights: 5,
    startingOverworldBuffs: 2,
    startingOverworldTraps: 2,
    startingShopGridWidth: 3,
    startingShopGridHeight: 4,
    startingShopItemNumber: 5,
    startingFightGoldReward: 5,
    startingFightBossGoldReward: 3,
    startingFightFlawlessGoldReward: 3,
    endLevel: 8,
    startingFightInputTypes: [
        FIGHT_INPUT_TYPES.REVEAL,
        FIGHT_INPUT_TYPES.FLAG,
        FIGHT_INPUT_TYPES.QUERY,
        FIGHT_INPUT_TYPES.REMOVE_TRASH,
        FIGHT_INPUT_TYPES.REMOVE_BOMB,
        FIGHT_INPUT_TYPES.REMOVE_LIES,
        FIGHT_INPUT_TYPES.UMBRELLA,
        FIGHT_INPUT_TYPES.TOWER,
        FIGHT_INPUT_TYPES.BLOCK,
    ],
    startingRemoveTrashNum: 3,
    startingRemoveBombNum: 2,
    startingRemoveLyingNum: 2,
    startingUmbrellaNum: 2,
    startingTowerNum: 2,
    startingBlockNum: 10,
    startingTrashTileNum: 2,
    startingLyingTileNum: 3,
    startingUmbrellaSize: 4,
    startingTowersize: 5,
    startingBlockSize: 3,
    advancedMechanics: [
        "fightCanHaveTrashTiles",
        "fightCanHaveLyingTiles",
        "fightCanHaveMultiBombTiles",
    ],
};

export const NAME_CHOICES = [
    "Jan Eator",
    "Cousteau Dian",
    "Han Demon",
    "May Tenance",
    "Dustin Buster",
];
