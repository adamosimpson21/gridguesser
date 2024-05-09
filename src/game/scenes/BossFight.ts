import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import FightGrid from "../classes/FightGrid";
import { SCENES } from "@/game/types/scenes";
import { GameState } from "@/game/classes/GameState";
import { GAME_EVENTS } from "@/game/types/events";
import BossFightGrid from "@/game/classes/BossFightGrid";
import FightInputMenu from "@/game/classes/FightInputMenu";
import { Fight } from "@/game/scenes/Fight";
import { createBackground } from "@/game/functions/background";

export class BossFight extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    mine: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    grid: FightGrid;
    inputMenu: FightInputMenu;
    public removeTrashUses: number;
    public removeBombUses: number;
    public removeLyingUses: number;

    constructor() {
        super(SCENES.BossFight);
    }

    preload() {
        this.load.spritesheet(
            "flagOverlay",
            "/assets/fight/flagOverlaySS.png",
            {
                frameWidth: 64,
                frameHeight: 64,
            },
        );
        // this.load.image("flag1", "/assets/fight/cautionSign.png");
        // this.load.image("flag2", "/assets/fight/cautionSign2.png");
        // this.load.image("flag3", "/assets/fight/cautionSign3.png");
        // this.load.image("flag4", "/assets/fight/cautionSign4.png");
        // this.load.image("flag5", "/assets/fight/cautionSign5.png");
        // this.load.image("flag6", "/assets/fight/cautionSign6.png");
        // this.load.image("flag7", "/assets/fight/cautionSign7.png");
        // this.load.image("flag8", "/assets/fight/cautionSign8.png");
        // this.load.image("flag9", "/assets/fight/cautionSign9.png");
        //
        this.load.image("enemy1", "/assets/fight/dustBunny.png");
        this.load.image("clipboard", "/assets/hud/longClipboard.png");
        //
        // this.load.image("enemy2", "/assets/fight/dustBunny2.png");
        //
        // this.load.image("enemy3", "/assets/fight/dustBunny3.png");
        //
        // this.load.image("enemy4", "/assets/fight/dustBunny4.png");
        //
        // this.load.image("enemy5", "/assets/fight/dustBunny5.png");
        //
        // this.load.image("enemy6", "/assets/fight/dustBunny6.png");
        //
        // this.load.image("enemy7", "/assets/fight/dustBunny7.png");
        //
        // this.load.image("enemy8", "/assets/fight/dustBunny8.png");
        // this.load.image("enemy9", "/assets/fight/dustBunny9.png");

        this.load.image("blank", "/assets/blank.png");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);

        this.background = createBackground(this);

        const gridWidth = Math.floor(GameState.fightGridWidth * 1.5);
        const gridHeight = Math.floor(GameState.fightGridHeight * 1.5);
        const numBombs = Math.floor(GameState.bombNum * 2);
        this.grid = new BossFightGrid(this, gridWidth, gridHeight, numBombs);

        this.camera.fadeIn(500, 0, 0, 0);

        EventBus.emit("current-scene-ready", this);
    }
    transitionScene(scene: string) {
        this.camera.fadeOut(1000, 0, 0, 0);
        this.camera.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            (cam: any) => {
                this.scene.start(scene);
            },
        );
    }
}
