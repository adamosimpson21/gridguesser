import { Scene } from "phaser";
import { SCENES } from "@/game/types/scenes";
import EventDisplay from "@/game/classes/EventDisplay";
import HudDisplay from "@/game/classes/HudDisplay";
import { EventBus } from "@/game/EventBus";
import { GAME_EVENTS } from "@/game/types/events";
import { GAME_CONSTANTS } from "@/game/types/gameConstants";
import OverworldLegend from "@/game/classes/OverworldLegend";
export class Hud extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    public eventDisplay: EventDisplay | undefined;
    public HudDisplay: HudDisplay | undefined;
    public OverworldLegend: OverworldLegend;

    constructor() {
        super(SCENES.Hud);
    }

    preload() {
        this.load.image("clipboard", "assets/hud/longClipboard.png");
        this.load.image("key_ring", "assets/hud/keyRing.png");
        this.load.image("black_key", "assets/hud/blackKey.png");
        this.load.spritesheet("input_hints", "assets/cursors/inputHints.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.image("red_border", "/assets/overworld/redBorder.png");
        this.load.image("orange_border", "/assets/overworld/orangeBorder.png");
        this.load.image("green_border", "/assets/overworld/greenBorder.png");
        this.load.image("yellow_border", "/assets/overworld/yellowBorder.png");
        this.load.image("purple_border", "/assets/overworld/purpleBorder.png");
        this.load.image("white_border", "/assets/overworld/whiteBorder.png");
    }

    create() {
        this.camera = this.cameras.main;
        this.HudDisplay = new HudDisplay(
            this,
            GAME_CONSTANTS.startingName,
            GAME_CONSTANTS.startingHp,
            GAME_CONSTANTS.startingGold,
            GAME_CONSTANTS.startingMaxHp,
        );
        this.OverworldLegend = new OverworldLegend(this);

        this.eventDisplay = new EventDisplay(this);
        // EventBus.on(GAME_EVENTS.RESET, () => {
        //     this.eventDisplay = new EventDisplay(this);
        // });

        EventBus.emit("current-scene-ready", this);
    }
}
