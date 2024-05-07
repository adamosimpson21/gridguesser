import EventDisplay from "@/game/classes/EventDisplay";
import { SCENES } from "@/game/types/scenes";
import { GAME_CONSTANTS } from "@/game/types/gameConstants";
import { EventBus } from "@/game/EventBus";
import { Scene } from "phaser";
import { trapType } from "@/game/types/trapConstants";
import TrapDisplay from "@/game/classes/TrapDisplay";

export class TrapOverlay extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    private trapDisplay: TrapDisplay;
    private trap: trapType;

    constructor() {
        super(SCENES.TrapOverlay);
    }

    init(trap: trapType) {
        this.trap = trap;
    }

    preload() {
        this.load.image("cubicle", "/assets/trap/cubicle.png");
    }

    create() {
        EventBus.emit("current-scene-ready", this);
        this.trapDisplay = new TrapDisplay(this, this.trap);
    }
}
