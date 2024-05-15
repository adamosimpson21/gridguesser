import { Scene } from "phaser";
import { SCENES } from "@/game/types/scenes";
import EventDisplay from "@/game/classes/EventDisplay";
import HudDisplay from "@/game/classes/HudDisplay";
import { EventBus } from "@/game/EventBus";
import { GAME_EVENTS } from "@/game/types/events";
import { GAME_CONSTANTS } from "@/game/types/gameConstants";
export class Hud extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    public eventDisplay: EventDisplay | undefined;
    public HudDisplay: HudDisplay | undefined;

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

        this.eventDisplay = new EventDisplay(this);
        EventBus.emit("current-scene-ready", this);
    }
}
