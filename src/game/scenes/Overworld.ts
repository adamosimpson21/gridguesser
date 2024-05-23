import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import OverworldGrid from "../classes/OverworldGrid";
import HudDisplay from "@/game/classes/HudDisplay";
import { SCENES } from "@/game/types/scenes";
import EventDisplay from "@/game/classes/EventDisplay";
import { GAME_EVENTS } from "@/game/types/events";
import { GameState } from "../classes/GameState";
import { createBackground } from "@/game/functions/background";
import { cameraFadeIn } from "@/game/functions/transitionScene";
import { Settings } from "@/game/scenes/Settings";
import { addPauseOverlay } from "@/game/functions/addPauseOverlay";

export class Overworld extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    private overworldGrid: OverworldGrid;
    public Hud: HudDisplay;
    public eventDisplay: EventDisplay;
    constructor() {
        super(SCENES.Overworld);
    }

    preload() {
        this.load.image(
            "overworld_floor",
            "assets/overworld/officeCarpet2.png",
        );
        this.load.image("red_border", "assets/overworld/redBorder.png");
        this.load.image("green_border", "assets/overworld/greenBorder.png");
        this.load.image("white_border", "assets/overworld/whiteBorder.png");
        this.load.image("orange_border", "assets/overworld/orangeBorder.png");
        this.load.image("purple_border", "assets/overworld/purpleBorder.png");
        this.load.image("yellow_border", "assets/overworld/yellowBorder.png");
        this.load.image("dust", "assets/overworld/dustBunny.png");
        this.load.image("player", "assets/overworld/janitor.png");
        this.load.image("carpet_lines", "assets/overworld/carpetLines.png");
        this.load.image("room_cleaned", "assets/overworld/roomCleaned.png");
        this.load.image("clipboard", "assets/hud/longClipboard.png");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);

        this.background = createBackground(this);
        cameraFadeIn(this);

        const gridWidth = GameState.overworldGridWidth;
        const gridHeight = GameState.overworldGridHeight;
        const numShops = GameState.overworldShops;
        const numFights = GameState.overworldFights;
        const numBuffs = GameState.overworldBuffs;
        const numTraps = GameState.overworldTraps;
        const numBosses = 1;

        this.overworldGrid = new OverworldGrid(this, gridWidth, gridHeight, {
            numBosses,
            numFights,
            numShops,
            numBuffs,
            numTraps,
        });

        EventBus.emit("current-scene-ready", this);

        EventBus.on(
            GAME_EVENTS.GAME_OVER,
            () => GameState.gameOver(this),
            this,
        );

        this.events.on(
            Phaser.Scenes.Events.RESUME,
            () => {
                this.camera.fadeIn(500, 0, 0, 0);
            },
            this,
        );

        addPauseOverlay(this);
    }
    // transitionScene(scene: string, data?: any) {
    //     this.camera.fadeOut(1000, 0, 0, 0);
    //     this.camera.once(
    //         Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
    //         (cam: any) => {
    //             this.scene.launch(scene, data).pause(SCENES.Overworld);
    //         },
    //     );
    // }
}
