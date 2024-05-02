import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import OverworldGrid from "../classes/OverworldGrid";
import HudDisplay from "@/game/classes/HudDisplay";
import { SCENES } from "@/game/types/scenes";
import EventDisplay from "@/game/classes/EventDisplay";
import { GAME_EVENTS } from "@/game/types/events";
import { GameState } from "../classes/GameState";

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
        this.load.image("overworld_floor", "assets/overworld/officeCarpet.png");
        this.load.image("red_border", "assets/overworld/redBorder.png");
        this.load.image("green_border", "assets/overworld/greenBorder.png");
        this.load.image("white_border", "assets/overworld/whiteBorder.png");
        this.load.image("orange_border", "assets/overworld/orangeBorder.png");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);

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
    }
    transitionScene(scene: string) {
        this.camera.fadeOut(1000, 0, 0, 0);
        this.camera.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            (cam: any) => {
                this.scene.launch(scene).pause(SCENES.Overworld);
            },
        );
    }
}
