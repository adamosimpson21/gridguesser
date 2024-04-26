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

    create() {
        this.cameras.resetAll();
        this.camera = this.cameras.main;
        this.HudDisplay = undefined;
        this.HudDisplay = new HudDisplay(
            this,
            GAME_CONSTANTS.startingName,
            GAME_CONSTANTS.startingHp,
            GAME_CONSTANTS.startingGold,
            GAME_CONSTANTS.startingMaxHp,
        );
        this.eventDisplay = undefined;
        this.eventDisplay = new EventDisplay(this);
        EventBus.emit("current-scene-ready", this);
    }
}
