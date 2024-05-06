import EventDisplay from "@/game/classes/EventDisplay";
import { SCENES } from "@/game/types/scenes";
import { GAME_CONSTANTS } from "@/game/types/gameConstants";
import { EventBus } from "@/game/EventBus";
import { Scene } from "phaser";

export class TrapOverlay extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;

    constructor() {
        super(SCENES.TrapOverlay);
    }

    preload() {
        this.load.image("/assets/trap/cubicle.png");
    }

    create() {
        EventBus.emit("current-scene-ready", this);
    }
}
