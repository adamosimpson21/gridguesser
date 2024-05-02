import { EventBus } from "@/game/EventBus";
import { GAME_EVENTS, PLAYER_EVENTS, UI_EVENTS } from "@/game/types/events";
import { shopItemType } from "@/game/types/shopItems";
import { Scene } from "phaser";
import { SCENES } from "@/game/types/scenes";
import { PlayerClass } from "@/game/classes/Player";
import { GAME_CONSTANTS } from "@/game/types/gameConstants";
import {
    FIGHT_CONSTANTS,
    FIGHT_INPUT_TYPES,
} from "@/game/types/fightConstants";

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
    public GameOverBtn: Phaser.GameObjects.Text;
    public fightInputTypes: string[];
    public currentFightInputType: string;
    public removeTrashNum: number;
    public removeBombNum: number;
    public trashTileNum: number;
    public lyingTileNum: number;
    public removeLyingNum: number;

    constructor() {
        this.isPlaying = true;
        this.player = new PlayerClass();
        this.create();

        EventBus.on(GAME_EVENTS.INCREMENT_LEVEL, () => this.incrementLevel());
        EventBus.on(GAME_EVENTS.RESET, () => this.reset(), this);
    }

    create() {
        this.reset();
    }

    gameOver(scene: Scene) {
        this.isPlaying = false;
        // adds this button to current active scene
        const currentScenes = scene.scene.systems.game.scene.getScenes(true);
        this.GameOverBtn = currentScenes[0].add
            .text(512, 200, "Oh no! Game Over 😭😭😭 👆🖱", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);
        this.GameOverBtn.setInteractive();
        this.GameOverBtn.on("pointerdown", () => {
            scene.scene.stop(SCENES.Fight);
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
        this.playerDamageReduction = 0;
        this.fightInputTypes = GAME_CONSTANTS.startingFightInputTypes;
        this.currentFightInputType = FIGHT_INPUT_TYPES.REVEAL;
        this.removeTrashNum = GAME_CONSTANTS.startingRemoveTrashNum;
        this.removeBombNum = GAME_CONSTANTS.startingRemoveBombNum;
        this.removeLyingNum = GAME_CONSTANTS.startingRemoveLyingNum;
        this.trashTileNum = GAME_CONSTANTS.startingTrashTileNum;
        this.lyingTileNum = GAME_CONSTANTS.startingLyingTileNum;
    }

    setLevel(level: number) {
        this.level = level;
    }

    incrementLevel() {
        this.level += 1;
        this.bombIntensity++;
        this.bombNum += 3;
        this.overworldGridWidth++;
        this.overworldGridHeight++;
        this.fightGridWidth += 2;
        this.fightGridHeight += 2;
        this.overworldFights += 3;
        this.overworldBuffs++;
        this.overworldTraps++;
        this.fightGoldReward += 2;
    }

    setBombIntensity(intensity: number) {
        this.bombIntensity = intensity;
    }

    updateFieldBy(field: string, intensity: number) {
        if (this.hasOwnProperty(field)) {
            // @ts-ignore
            this[field] += intensity;
        }
    }
}

export const GameState = new GameStateClass();
