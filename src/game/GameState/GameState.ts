import { EventBus } from "@/game/EventBus/EventBus";
import {
    FIGHT_EVENTS,
    GAME_EVENTS,
    PLAYER_EVENTS,
    SCENE_EVENTS,
    UI_EVENTS,
} from "@/game/EventBus/events";
import { SHOP_ITEMS, shopItemType, SPECIAL_ITEMS } from "@/game/Shop/shopItems";
import {
    AdvancedMechanic,
    CHARACTER_CHOICES,
    characterType,
    GAME_CONSTANTS,
} from "@/game/GameState/gameConstants";
import {
    FIGHT_CONSTANTS,
    FIGHT_INPUT_TYPES,
} from "@/game/Fight/fightConstants";
import { getInputInstanceUsesAvailable } from "@/game/functions/getInputUsesAvailable";
import { LocalStorageManager } from "@/game/Settings/LocalStorageManager";
import { SETTING_CONSTANTS } from "@/game/Settings/settingConstants";

export class GameStateClass {
    // stores information about current run
    public level: number;
    public ascension: number;
    public bombIntensity: number;
    public isPlaying: boolean;
    public bombNum: number;
    public overworldGridWidth: number;
    public overworldGridHeight: number;
    public fightGridWidth: number;
    public shopGridHeight: number;
    public shopGridWidth: number;
    public fightGridHeight: number;
    public bossFightGridChange: number;
    public bossFightBombChange: number;
    public trustedNumbers: number[];
    public overworldShops: number;
    public overworldFights: number;
    public overworldBuffs: number;
    public overworldTraps: number;
    public shopItemNumber: number;
    public playerDamageReduction: number;
    public fightGoldReward: number;
    public fightCanHaveTrashTiles: boolean;
    public fightCanHaveLyingTiles: boolean;
    public fightCanHaveMultiBombTiles: boolean;
    public bombCounterCanLie: boolean;
    // public GameOverBtn: Phaser.GameObjects.Text;
    public fightInputTypes: string[];
    public currentFightInputType: string;
    public removeTrashNum: number;
    public removeBombNum: number;
    public trashTileNum: number;
    public lyingTileNum: number;
    public removeLyingNum: number;
    public luck: number;
    public fightFlawlessGoldReward: number;
    public fightBossGoldReward: number;
    public instanceRemoveTrashNum: number;
    public instanceRemoveBombNum: number;
    public instanceRemoveLyingNum: number;
    public umbrellaNum: number;
    public pesticideNum: number;
    public towerNum: number;
    public blockNum: number;
    public instanceUmbrellaNum: number;
    public instancePesticideNum: number;
    public instanceTowerNum: number;
    public instanceBlockNum: number;
    public umbrellaSize: number;
    public lyingSize: number;
    public pesticideSize: number;
    public towerSize: number;
    public blockSize: number;
    public bombNumFightIncrement: number;
    public bombCounterCanLiePercent: number;
    public hasLocalStorage: boolean;
    public character: characterType;
    public hp: number;
    public gold: number;
    public maxHp: number;
    public upgrades: shopItemType[];
    public fightCanHaveTentacles: boolean;
    public tentacleTileNum: number;
    public tentacleGrowthIncrement: number;
    public initialClickSize: number;
    public hasDyscalc: boolean;
    public klutz: boolean;

    constructor() {
        this.isPlaying = true;
        this.create();
        this.hasLocalStorage = false;

        EventBus.on(GAME_EVENTS.INCREMENT_LEVEL, () => this.incrementLevel());
        EventBus.on(FIGHT_EVENTS.USE_LIMITED_INPUT, (inputType: string) => {
            if (inputType === FIGHT_INPUT_TYPES.REMOVE_BOMB) {
                GameState.instanceRemoveBombNum--;
                if (GameState.instanceRemoveBombNum === 0) {
                    EventBus.emit(
                        FIGHT_EVENTS.CHANGE_INPUT_TYPE,
                        FIGHT_INPUT_TYPES.REVEAL,
                    );
                }
            } else if (inputType === FIGHT_INPUT_TYPES.REMOVE_TRASH) {
                GameState.instanceRemoveTrashNum--;
                if (GameState.instanceRemoveTrashNum === 0) {
                    EventBus.emit(
                        FIGHT_EVENTS.CHANGE_INPUT_TYPE,
                        FIGHT_INPUT_TYPES.REVEAL,
                    );
                }
            } else if (inputType === FIGHT_INPUT_TYPES.REMOVE_LIES) {
                GameState.instanceRemoveLyingNum--;
                if (GameState.instanceRemoveLyingNum === 0) {
                    EventBus.emit(
                        FIGHT_EVENTS.CHANGE_INPUT_TYPE,
                        FIGHT_INPUT_TYPES.REVEAL,
                    );
                }
            } else if (inputType === FIGHT_INPUT_TYPES.UMBRELLA) {
                GameState.instanceUmbrellaNum--;
                if (GameState.instanceUmbrellaNum === 0) {
                    EventBus.emit(
                        FIGHT_EVENTS.CHANGE_INPUT_TYPE,
                        FIGHT_INPUT_TYPES.REVEAL,
                    );
                }
            } else if (inputType === FIGHT_INPUT_TYPES.PESTICIDE) {
                GameState.instancePesticideNum--;
                if (GameState.instancePesticideNum === 0) {
                    EventBus.emit(
                        FIGHT_EVENTS.CHANGE_INPUT_TYPE,
                        FIGHT_INPUT_TYPES.REVEAL,
                    );
                }
            } else if (inputType === FIGHT_INPUT_TYPES.TOWER) {
                GameState.instanceTowerNum--;
                if (GameState.instanceTowerNum === 0) {
                    EventBus.emit(
                        FIGHT_EVENTS.CHANGE_INPUT_TYPE,
                        FIGHT_INPUT_TYPES.REVEAL,
                    );
                }
            } else if (inputType === FIGHT_INPUT_TYPES.BLOCK) {
                GameState.instanceBlockNum--;
                if (GameState.instanceBlockNum === 0) {
                    EventBus.emit(
                        FIGHT_EVENTS.CHANGE_INPUT_TYPE,
                        FIGHT_INPUT_TYPES.REVEAL,
                    );
                }
            }
        });
        EventBus.on(FIGHT_EVENTS.CHANGE_INPUT_TYPE, (newInputType: string) => {
            this.updateFightInputType(newInputType);
        });
        EventBus.on(FIGHT_EVENTS.FIGHT_WON, (isBoss: boolean) => {
            this.fightWon(isBoss);
        });
        EventBus.on(FIGHT_EVENTS.ADD_INPUT_TYPE, (inputType: string) => {
            this.fightInputTypes.push(inputType);
        });
        EventBus.on(SCENE_EVENTS.ENTER_FIGHT, () => {
            this.resetFightConstants();
            this.resetSingleUseUpgrades();
        });
        EventBus.on(
            GAME_EVENTS.START_NEW_GAME,
            (ascension: number, character: string) => {
                this.startNewGame(ascension, character);
            },
            this,
        );
        EventBus.on(GAME_EVENTS.ABANDON_RUN, () => {
            LocalStorageManager.removeCurrentCampaignItem();
            LocalStorageManager.setItem(
                SETTING_CONSTANTS.hasActiveCampaign,
                false,
            );
            EventBus.emit(GAME_EVENTS.RESET);
        });
        EventBus.on(
            GAME_EVENTS.GAME_OVER,
            () => {
                LocalStorageManager.removeCurrentCampaignItem();
                LocalStorageManager.setItem(
                    SETTING_CONSTANTS.hasActiveCampaign,
                    false,
                );
            },
            this,
        );
        EventBus.on(GAME_EVENTS.GAME_WON, () => {
            LocalStorageManager.setItem(
                SETTING_CONSTANTS.hasActiveCampaign,
                false,
            );
            LocalStorageManager.removeCurrentCampaignItem();
            let ascensionInfo = LocalStorageManager.getItem(
                SETTING_CONSTANTS.ascension,
            );

            if (!ascensionInfo.ascension[this.character.id]) {
                ascensionInfo.ascension[this.character.id] = 0;
            }
            // highest ascension beaten
            if (
                ascensionInfo.ascension[this.character.id] <= this.ascension &&
                this.ascension < GAME_CONSTANTS.maxAscension
            ) {
                EventBus.emit(GAME_EVENTS.UNLOCK_ASCENSION, this.ascension + 1);
                ascensionInfo.ascension[this.character.id] = this.ascension + 1;
                console.log(
                    "in game won, setting new ascension info:",
                    ascensionInfo,
                );
                LocalStorageManager.setItem(
                    SETTING_CONSTANTS.ascension,
                    ascensionInfo,
                );
            }
        });
        EventBus.on(GAME_EVENTS.LOAD_CAMPAIGN, () => {
            this.hydrateGameState();
        });
        // EventBus.on(
        // PLAYER_EVENTS.CHANGE_CHARACTER,
        // (character: characterType) => {
        //     this.character = character;
        //     EventBus.emit(UI_EVENTS.UPDATE_NAME, character.name);
        // },
        // );
        EventBus.on(
            PLAYER_EVENTS.GAIN_HP,
            (severity: number, silent?: boolean) => {
                this.updateHp(this.hp + severity, this.maxHp, silent);
            },
        );
        EventBus.on(
            PLAYER_EVENTS.LOSE_HP,
            (severity: number, silent?: boolean) => {
                let damageAfterReduction =
                    severity - GameState.playerDamageReduction;
                if (damageAfterReduction <= 0) {
                    severity = 0;
                    silent = true;
                } else {
                    severity = damageAfterReduction;
                }
                this.updateHp(this.hp - severity, this.maxHp, silent);
            },
        );
        EventBus.on(
            PLAYER_EVENTS.GAIN_GOLD,
            (severity: number, silent?: boolean) => {
                this.updateGold(severity, silent);
            },
        );
        EventBus.on(
            PLAYER_EVENTS.LOSE_GOLD,
            (severity: number, silent?: boolean) => {
                this.updateGold(-severity, silent);
            },
        );
        EventBus.on(
            PLAYER_EVENTS.GAIN_MAX_HP,
            (severity: number, addHp: number, silent?: boolean) => {
                this.updateHp(this.hp + addHp, this.maxHp + severity, silent);
            },
        );
        EventBus.on(
            PLAYER_EVENTS.LOSE_MAX_HP,
            (severity: number, silent?: boolean) => {
                this.updateHp(
                    this.hp - severity,
                    this.maxHp - severity,
                    silent,
                );
            },
        );
        EventBus.on(
            PLAYER_EVENTS.GAIN_UPGRADE,
            (upgrade: shopItemType, silent?: boolean) => {
                this.updateUpgrades(upgrade, true, silent);
            },
        );
        EventBus.on(
            PLAYER_EVENTS.LOSE_UPGRADE,
            (upgrade: shopItemType, silent?: boolean) => {
                this.updateUpgrades(upgrade, false, silent);
            },
        );
        EventBus.on(
            PLAYER_EVENTS.HIT_BOMB,
            (numBombs: number, silent?: boolean) => {
                this.hitBomb(numBombs, silent);
            },
        );
    }

    create() {
        this.initializeNewGameConstants(0, GAME_CONSTANTS.startingCharacter);
    }

    updateHp(hp?: number, maxHp?: number, silent?: boolean) {
        const prevHp = this.hp;
        let hpToUpdate = hp || this.hp;
        // cover corner case where hp === 0
        if (hp === 0) {
            hpToUpdate = hp;
        }
        let maxHpToUpdate = maxHp || this.hp;
        // cover corner case where maxHp === 0
        if (maxHp === 0) {
            maxHpToUpdate = maxHp;
        }
        // if maxhp is somehow 0 or negative, let them live
        if (maxHpToUpdate <= 0) {
            maxHpToUpdate = 1;
        }
        if (hpToUpdate <= 0) {
            EventBus.emit(GAME_EVENTS.GAME_OVER);
        } else if (hpToUpdate >= maxHpToUpdate) {
            hpToUpdate = maxHpToUpdate;
        }

        this.hp = hpToUpdate;
        this.maxHp = maxHpToUpdate;
        const hpChange = this.hp - prevHp;
        EventBus.emit(
            UI_EVENTS.UPDATE_HEALTH,
            hpToUpdate,
            maxHpToUpdate,
            hpChange,
            silent,
        );
    }

    updateGold(goldDifference: number, silent?: boolean) {
        let goldToUpdate = goldDifference;
        if (goldDifference + this.gold >= 0) {
            goldToUpdate = this.gold + goldDifference;
        } else {
            goldToUpdate = 0;
        }

        this.gold = goldToUpdate;

        EventBus.emit(
            UI_EVENTS.UPDATE_GOLD,
            goldToUpdate,
            goldDifference,
            silent,
        );
    }

    reset() {}

    startNewGame(ascension: number, character: string) {
        LocalStorageManager.removeCurrentCampaignItem();
        this.initializeNewGameConstants(ascension, character);
        this.isPlaying = true;

        LocalStorageManager.setItem(SETTING_CONSTANTS.hasActiveCampaign, true);
    }

    useCharacterChoice() {
        EventBus.emit(UI_EVENTS.UPDATE_NAME, this.character.name);
        if (this.character.id === "CHAR_ONE") {
            EventBus.emit(
                PLAYER_EVENTS.GAIN_UPGRADE,
                SPECIAL_ITEMS["INFINITY_CHIPS"],
            );
        } else if (this.character.id === "CHAR_SIX") {
            EventBus.emit(
                PLAYER_EVENTS.GAIN_UPGRADE,
                SHOP_ITEMS["REDUCE_DAMAGE_ONE"],
            );
            EventBus.emit(
                PLAYER_EVENTS.GAIN_UPGRADE,
                SHOP_ITEMS["GRID_SHRINK_ONE"],
            );
            EventBus.emit(
                PLAYER_EVENTS.GAIN_UPGRADE,
                SHOP_ITEMS["GRID_SHRINK_ONE"],
            );
            // no clue why this is so janky
            this.playerDamageReduction++;
            this.fightGridWidth -= 2;
            this.fightGridHeight -= 2;
            EventBus.emit(PLAYER_EVENTS.GAIN_MAX_HP, 8, 8, true);
        } else if (this.character.id === "CHAR_SEVEN") {
            this.hasDyscalc = true;
            this.lyingTileNum += 3;
            this.fightCanHaveLyingTiles = true;
            EventBus.emit(
                PLAYER_EVENTS.GAIN_UPGRADE,
                SHOP_ITEMS["MOVE_BOMB_ONE"],
            );
            EventBus.emit(
                PLAYER_EVENTS.GAIN_UPGRADE,
                SHOP_ITEMS["MOVE_BOMB_ONE"],
            );
        } else if (this.character.id === "CHAR_TWO") {
            EventBus.emit(PLAYER_EVENTS.GAIN_UPGRADE, SHOP_ITEMS["NEST_EGG"]);
        } else if (this.character.id === "CHAR_FOUR") {
            EventBus.emit(FIGHT_EVENTS.ADD_INPUT_TYPE, "Dust Suck");
        } else if (this.character.id === "CHAR_THREE") {
            this.klutz = true;
        } else if (this.character.id === "CHAR_FIVE") {
            ////////// ????
        }
    }

    hitBomb(numBombs: number, silent?: boolean) {
        const bombDamage = GameState.bombIntensity * numBombs;
        EventBus.emit(PLAYER_EVENTS.LOSE_HP, bombDamage, silent);
    }

    hydrateGameState() {
        const serializedCampaign = LocalStorageManager.getCurrentCampaignItem();
        if (serializedCampaign?.gameState) {
            Object.entries(serializedCampaign?.gameState).forEach(
                (row: [string, any]) => {
                    // if (row[0] === "hp") {
                    //     console.log("hp:", row[1]);
                    // }
                    (this as any)[row[0]] = row[1];
                },
            );
            EventBus.emit(UI_EVENTS.UPDATE_NAME, this.character.name);
            EventBus.emit(UI_EVENTS.UPDATE_GOLD, this.gold, 0, true);
            EventBus.emit(
                UI_EVENTS.UPDATE_HEALTH,
                this.hp,
                this.maxHp,
                0,
                true,
            );
            this.upgrades.forEach((upgrade, index) => {
                EventBus.emit(
                    UI_EVENTS.UPDATE_UPGRADES,
                    upgrade,
                    index,
                    true,
                    true,
                );
            });
        }
    }

    updateUpgrades(upgrade: shopItemType, gained: boolean, silent?: boolean) {
        // EventBus.emit(SCENE_EVENTS.SHOW_HUD);
        if (gained) {
            EventBus.emit(
                UI_EVENTS.UPDATE_UPGRADES,
                upgrade,
                this.upgrades.length,
                gained,
                silent,
            );
            this.upgrades.push(upgrade);
        } else {
            const index = this.upgrades.findIndex(
                (item) => item.id === upgrade.id,
            );
            if (index !== -1) {
                this.upgrades = this.upgrades.splice(index, 1);
                EventBus.emit(
                    UI_EVENTS.UPDATE_UPGRADES,
                    upgrade,
                    this.upgrades.length,
                    gained,
                    silent,
                );
            }
        }
    }

    initializeNewGameConstants(ascension: number, character: string) {
        if (LocalStorageManager.getItem(SETTING_CONSTANTS.isMobile)) {
            FIGHT_CONSTANTS.TILE_HEIGHT = 64;
            FIGHT_CONSTANTS.TILE_WIDTH = 64;
        }

        this.character = CHARACTER_CHOICES[character];
        this.hp = GAME_CONSTANTS.startingHp;
        this.maxHp = GAME_CONSTANTS.startingMaxHp;
        this.gold = GAME_CONSTANTS.startingGold;
        this.luck = GAME_CONSTANTS.startingLuck;
        this.upgrades = [];
        this.level = GAME_CONSTANTS.startingLevel;
        this.ascension = GAME_CONSTANTS.startingAscension;
        this.initialClickSize = GAME_CONSTANTS.startingInitialClickSize;
        this.bombIntensity = GAME_CONSTANTS.startingBombIntensity;
        this.bombNum = GAME_CONSTANTS.startingBombNum;
        this.bombNumFightIncrement =
            GAME_CONSTANTS.startingFightBombNumIncrement;
        this.overworldGridWidth = GAME_CONSTANTS.startingOverworldGridWidth;
        this.overworldGridHeight = GAME_CONSTANTS.startingOverworldGridHeight;
        this.fightGridWidth = GAME_CONSTANTS.startingFightGridWidth;
        this.fightGridHeight = GAME_CONSTANTS.startingFightGridHeight;
        this.shopGridWidth = GAME_CONSTANTS.startingShopGridWidth;
        this.shopGridHeight = GAME_CONSTANTS.startingShopGridHeight;
        this.overworldShops = GAME_CONSTANTS.startingOverworldShops;
        this.overworldFights = GAME_CONSTANTS.startingOverworldFights;
        this.overworldBuffs = GAME_CONSTANTS.startingOverworldBuffs;
        this.overworldTraps = GAME_CONSTANTS.startingOverworldTraps;
        this.shopItemNumber = GAME_CONSTANTS.startingShopItemNumber;
        this.fightGoldReward = GAME_CONSTANTS.startingFightGoldReward;
        this.fightCanHaveTrashTiles = FIGHT_CONSTANTS.CAN_HAVE_TRASH_TILES;
        this.fightCanHaveLyingTiles = FIGHT_CONSTANTS.CAN_HAVE_LYING_TILES;
        this.fightCanHaveMultiBombTiles =
            FIGHT_CONSTANTS.CAN_HAVE_MULTI_BOMB_TILES;
        this.fightCanHaveTentacles = FIGHT_CONSTANTS.CAN_HAVE_TENTACLES;
        this.bombCounterCanLie = FIGHT_CONSTANTS.BOMB_COUNTER_CAN_LIE;
        this.playerDamageReduction = 0;
        this.fightInputTypes = [...GAME_CONSTANTS.startingFightInputTypes];
        this.currentFightInputType = FIGHT_INPUT_TYPES.REVEAL;
        this.removeTrashNum = GAME_CONSTANTS.startingRemoveTrashNum;
        this.removeBombNum = GAME_CONSTANTS.startingRemoveBombNum;
        this.removeLyingNum = GAME_CONSTANTS.startingRemoveLyingNum;
        this.lyingSize = GAME_CONSTANTS.startingRemoveLyingSize;
        this.umbrellaNum = GAME_CONSTANTS.startingUmbrellaNum;
        this.umbrellaSize = GAME_CONSTANTS.startingUmbrellaSize;
        this.pesticideNum = GAME_CONSTANTS.startingPesticideNum;
        this.pesticideSize = GAME_CONSTANTS.startingPesticideSize;
        this.towerNum = GAME_CONSTANTS.startingTowerNum;
        this.towerSize = GAME_CONSTANTS.startingTowerSize;
        this.blockNum = GAME_CONSTANTS.startingBlockNum;
        this.blockSize = GAME_CONSTANTS.startingBlockSize;
        this.trashTileNum = GAME_CONSTANTS.startingTrashTileNum;
        this.lyingTileNum = GAME_CONSTANTS.startingLyingTileNum;
        this.bombCounterCanLiePercent =
            GAME_CONSTANTS.startingBombCounterCanLiePercent;
        this.tentacleTileNum = GAME_CONSTANTS.startingTentacleNum;
        this.tentacleGrowthIncrement = FIGHT_CONSTANTS.TENTACLE_INCREMENT;
        this.hasDyscalc = false;
        this.klutz = false;
        this.bossFightGridChange = GAME_CONSTANTS.startingBossFightGridChange;
        this.bossFightBombChange = GAME_CONSTANTS.startingBossFightBombChange;
        this.trustedNumbers = [...GAME_CONSTANTS.startingTrustedNumbers];

        this.resetFightConstants();

        this.resetSingleUseUpgrades();

        this.fightFlawlessGoldReward =
            GAME_CONSTANTS.startingFightFlawlessGoldReward;

        this.upgrades.forEach((upgrade) => {
            EventBus.emit(UI_EVENTS.UPDATE_UPGRADES, upgrade, true, true);
        });

        this.fightBossGoldReward = GAME_CONSTANTS.startingFightBossGoldReward;
        this.useCharacterChoice();
        this.handleAscension(ascension);

        EventBus.emit(UI_EVENTS.UPDATE_NAME, this.character.name);
        EventBus.emit(UI_EVENTS.UPDATE_GOLD, this.gold, 0, true);
        EventBus.emit(UI_EVENTS.UPDATE_HEALTH, this.hp, this.maxHp, 0, true);
    }

    resetFightConstants() {
        this.instanceRemoveTrashNum = this.removeTrashNum;
        this.instanceRemoveBombNum = this.removeBombNum;
        this.instanceRemoveLyingNum = this.removeLyingNum;
        this.instanceUmbrellaNum = this.umbrellaNum;
        this.instancePesticideNum = this.pesticideNum;
        this.instanceTowerNum = this.towerNum;
        this.instanceBlockNum = this.blockNum;
        EventBus.emit(GAME_EVENTS.RESET_FIGHT_INPUT_MENU);
    }

    resetSingleUseUpgrades() {
        this.upgrades.forEach((upgrade) => {
            if (upgrade.activated) {
                upgrade.hasBeenUsed = false;
            }
        });
    }

    handleAscension(ascension: number) {
        this.ascension = ascension;
        if (this.ascension >= 1) {
            this.addAdvancedMechanic();
            this.addAdvancedMechanic();
        }
        if (this.ascension >= 2) {
            this.bombNum += 2;
        }
        if (this.ascension >= 3) {
            this.fightGoldReward -= 2;
        }
        if (this.ascension >= 4) {
            this.bossFightGridChange -= 2;
        }
        if (this.ascension >= 5) {
            // handled in this.incrementLevel()
        }
        if (this.ascension >= 6) {
            this.bombNumFightIncrement += 1;
        }
        if (this.ascension >= 7) {
            this.luck -= 0.25;
        }
        if (this.ascension >= 8) {
            this.bossFightBombChange += 10;
        }
        if (this.ascension >= 9) {
            this.fightFlawlessGoldReward -= 2;
        }
        if (this.ascension >= 10) {
            this.addAdvancedMechanic();
            this.addAdvancedMechanic();
            // fifth mechanic??
            this.addAdvancedMechanic();
        }
        if (this.ascension >= 11) {
            this.overworldShops--;
        }
        if (this.ascension >= 12) {
            this.gold -= 5;
        }
        if (this.ascension >= 13) {
            this.bombIntensity++;
        }
        if (this.ascension >= 14) {
            // does not actually affect the game yet (right click)
            this.fightInputTypes.splice(
                this.fightInputTypes.indexOf(FIGHT_INPUT_TYPES.FLAG),
                1,
            );
            this.fightInputTypes.splice(
                this.fightInputTypes.indexOf(FIGHT_INPUT_TYPES.QUERY),
                1,
            );
        }
        if (this.ascension >= 15) {
            this.hp = Math.floor(this.hp / 2);
            this.maxHp = this.hp;
        }
        if (this.ascension >= 16) {
            // ????????????
        }
        if (this.ascension >= 17) {
            // keys have less uses
        }
        if (this.ascension >= 18) {
            this.fightGridHeight -= 2;
            this.fightGridWidth -= 2;
        }
        if (this.ascension >= 19) {
            // ???????????????
        }
        if (this.ascension >= 20) {
            // ???????????????
        }
    }

    addAdvancedMechanic() {
        let hasAdded = false;
        Phaser.Utils.Array.Shuffle(GAME_CONSTANTS.advancedMechanics).forEach(
            (mechanic: AdvancedMechanic) => {
                if (!GameState[mechanic] && !hasAdded) {
                    hasAdded = true;
                    this[mechanic] = true;
                }
            },
        );
    }

    hasUpgrade(upgradeId: string) {
        return (
            this.upgrades.findIndex((upgrade) => {
                return upgrade.id === upgradeId;
            }) !== -1
        );
    }

    activateAllUpgrades(upgradeId: string) {
        let numUsed = 0;
        this.upgrades.forEach((upgrade, index) => {
            if (upgrade.id === upgradeId && !upgrade.hasBeenUsed) {
                upgrade.hasBeenUsed = true;
                EventBus.emit(UI_EVENTS.USE_UPGRADE, index);
                numUsed++;
            }
        });

        if (numUsed > 0) {
            switch (upgradeId) {
                case "HARBROOM":
                    EventBus.emit(
                        PLAYER_EVENTS.GAIN_HP,
                        SHOP_ITEMS["HARBROOM"].effect.activatedGainHp * numUsed,
                    );
                    break;
                case "BROOMTAR":
                    EventBus.emit(
                        PLAYER_EVENTS.GAIN_GOLD,
                        SHOP_ITEMS["BROOMTAR"].effect.activatedGainGold *
                            numUsed,
                    );
                    break;
                case "BROOMDRUM":
                    EventBus.emit(
                        PLAYER_EVENTS.GAIN_MAX_HP,
                        SHOP_ITEMS["BROOMDRUM"].effect.activatedGainMaxhp *
                            numUsed,
                    );
                    break;
                default:
                    break;
            }
        }

        return numUsed;
    }

    numberOfUpgrade(upgradeId: string) {
        let numUsed = 0;
        this.upgrades.forEach((upgrade, index) => {
            if (upgrade.id === upgradeId) {
                numUsed++;
            }
        });
        return numUsed;
    }

    updateFightInputType(fightInputType: string) {
        if (getInputInstanceUsesAvailable(fightInputType) != 0) {
            this.currentFightInputType = fightInputType;
        }
    }

    incrementLevel() {
        this.level += 1;
        this.bombIntensity++;
        this.bombNum += 8;
        this.overworldGridWidth++;
        // this.overworldGridHeight++;
        if (this.ascension <= 5) {
            this.fightGridWidth += 2;
            this.fightGridHeight += 2;
        }
        this.overworldFights += 2;
        this.overworldBuffs += 2;
        // this.overworldTraps++;
        this.bossFightBombChange += 8;
        // this.fightGoldReward += 2;
        this.lyingTileNum += 1;
        this.trashTileNum += 2;
        this.tentacleTileNum++;
        this.bombCounterCanLiePercent += 5;
    }

    fightWon(isBoss: boolean) {
        if (isBoss) {
            this.incrementLevel();
        }
        this.bombNum += this.bombNumFightIncrement;
    }
}

export const GameState = new GameStateClass();
