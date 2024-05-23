import { EventBus } from "@/game/EventBus";
import {
    FIGHT_EVENTS,
    GAME_EVENTS,
    PLAYER_EVENTS,
    UI_EVENTS,
} from "@/game/types/events";
import { shopItemType } from "@/game/types/shopItems";
import { Scene } from "phaser";
import { SCENES } from "@/game/types/scenes";
import { PlayerClass } from "@/game/classes/Player";
import { GAME_CONSTANTS } from "@/game/types/gameConstants";
import {
    FIGHT_CONSTANTS,
    FIGHT_INPUT_TYPES,
} from "@/game/types/fightConstants";
import { getInputInstanceUsesAvailable } from "@/game/functions/getInputUsesAvailable";
import { headingText } from "@/game/types/textStyleConstructor";
import { Simulate } from "react-dom/test-utils";
import input = Simulate.input;

class GameStateClass {
    // stores information about current run
    public level: number;
    public bombIntensity: number;
    public isPlaying: boolean;
    public player: any;
    public bombNum: number;
    public overworldGridWidth: number;
    public overworldGridHeight: number;
    public fightGridWidth: number;
    public shopGridHeight: number;
    public shopGridWidth: number;
    public fightGridHeight: number;
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
    public GameOverBtn: Phaser.GameObjects.Text;
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
    public towerNum: number;
    public blockNum: number;
    public instanceUmbrellaNum: number;
    public instanceTowerNum: number;
    public instanceBlockNum: number;
    public umbrellaSize: number;
    public towerSize: number;
    public blockSize: number;
    public bombNumFightIncrement: number;
    public bombCounterCanLiePercent: number;
    public hasLocalStorage: boolean;

    constructor() {
        this.isPlaying = true;
        this.player = new PlayerClass();
        this.create();
        this.hasLocalStorage = false;

        EventBus.on(GAME_EVENTS.INCREMENT_LEVEL, () => this.incrementLevel());
        EventBus.on(GAME_EVENTS.RESET, () => this.reset(), this);
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
    }

    create() {
        this.reset();
    }

    gameOver(scene: Scene) {
        this.isPlaying = false;
        // adds this button to current active scene
        const currentScenes = scene.scene.systems.game.scene.getScenes(true);
        this.GameOverBtn = currentScenes[0].add
            .text(
                scene.scale.width / 2 - 200,
                200,
                "Oh no! Game Over 😭😭😭",
                headingText({}),
            )
            .setOrigin(0.5)
            .setDepth(100);
        this.GameOverBtn.setInteractive();
        this.GameOverBtn.on("pointerdown", () => {
            scene.scene.stop(SCENES.Fight);
            scene.scene.stop(SCENES.BossFight);
            scene.scene.start(SCENES.GameOver);
        });
    }

    reset() {
        this.initializeNewGameConstants();
        this.isPlaying = true;
    }

    initializeNewGameConstants() {
        this.level = GAME_CONSTANTS.startingLevel;
        this.bombIntensity = GAME_CONSTANTS.startingBombIntensity;
        this.bombNum = GAME_CONSTANTS.startingBombNum;
        this.bombNumFightIncrement = FIGHT_CONSTANTS.BOMB_NUM_INCREMENT;
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
        this.bombCounterCanLie = FIGHT_CONSTANTS.BOMB_COUNTER_CAN_LIE;
        this.playerDamageReduction = 0;
        this.fightInputTypes = GAME_CONSTANTS.startingFightInputTypes;
        this.currentFightInputType = FIGHT_INPUT_TYPES.REVEAL;
        this.removeTrashNum = GAME_CONSTANTS.startingRemoveTrashNum;
        this.removeBombNum = GAME_CONSTANTS.startingRemoveBombNum;
        this.removeLyingNum = GAME_CONSTANTS.startingRemoveLyingNum;
        this.umbrellaNum = GAME_CONSTANTS.startingUmbrellaNum;
        this.umbrellaSize = GAME_CONSTANTS.startingUmbrellaSize;
        this.towerNum = GAME_CONSTANTS.startingTowerNum;
        this.towerSize = GAME_CONSTANTS.startingTowersize;
        this.blockNum = GAME_CONSTANTS.startingBlockNum;
        this.blockSize = GAME_CONSTANTS.startingBlockSize;
        this.trashTileNum = GAME_CONSTANTS.startingTrashTileNum;
        this.lyingTileNum = GAME_CONSTANTS.startingLyingTileNum;
        this.bombCounterCanLiePercent =
            GAME_CONSTANTS.startingBombCounterCanLiePercent;

        this.resetFightConstants();

        this.fightFlawlessGoldReward =
            GAME_CONSTANTS.startingFightFlawlessGoldReward;

        this.fightBossGoldReward = GAME_CONSTANTS.startingFightBossGoldReward;

        EventBus.emit(GAME_EVENTS.RESET_FIGHT_INPUT_MENU);
    }

    resetFightConstants() {
        this.instanceRemoveTrashNum = this.removeTrashNum;
        this.instanceRemoveBombNum = this.removeBombNum;
        this.instanceRemoveLyingNum = this.removeLyingNum;
        this.instanceUmbrellaNum = this.umbrellaNum;
        this.instanceTowerNum = this.towerNum;
        this.instanceBlockNum = this.blockNum;
        EventBus.emit(GAME_EVENTS.RESET_FIGHT_INPUT_MENU);
    }

    updateFightInputType(fightInputType: string) {
        if (getInputInstanceUsesAvailable(fightInputType) != 0) {
            this.currentFightInputType = fightInputType;
        }
    }
    // setLevel(level: number) {
    //     this.level = level;
    // }

    incrementLevel() {
        this.level += 1;
        this.bombIntensity++;
        this.bombNum += 4;
        this.overworldGridWidth++;
        this.overworldGridHeight++;
        this.fightGridWidth += 2;
        this.fightGridHeight += 2;
        this.overworldFights += 3;
        this.overworldBuffs++;
        this.overworldTraps++;
        this.fightGoldReward += 2;
        this.lyingTileNum++;
        this.trashTileNum++;
        this.bombCounterCanLiePercent += 5;
    }

    fightWon(isBoss: boolean) {
        if (isBoss) {
            this.incrementLevel();
        }
        this.bombNum += this.bombNumFightIncrement;
    }

    // setBombIntensity(intensity: number) {
    //     this.bombIntensity = intensity;
    // }
    //
    // updateFieldBy(field: string, intensity: number) {
    //     if (this.hasOwnProperty(field)) {
    //         // @ts-ignore
    //         this[field] += intensity;
    //     }
    // }
}

export const GameState = new GameStateClass();
